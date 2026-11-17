# Frontend audit — 2026-11-15

Read-only. Nothing in `resources/js` was changed. Scope: `resources/js/src` (228 files, about 58,000 lines of Vue 2.7,
Vuex 3, vue-router 3, axios, bootstrap-vue), the page shell in `resources/views`, `webpack.mix.js` and `tests/js`.
Where a finding needed the other side, the route or controller was read too, so a few items are backend lines that
the frontend exposes.

Four reviewers read one slice each; **[V]** marks a finding re-checked against the code afterwards, **[R]** one read
by the reviewer only, **[P]** probable. Nothing was run in a browser. Files holding another developer's uncommitted
work are marked **(wip)**.

The backend audit is `AUDIT_2026-11-10.md`.

## 1. Fix first — security

- **FS1 [V]** `app/User.php:42` + `Admin/UserController.php:18-25` → `GET /superadmin/all-user/0` returns every
  user's `latest_token`, their live sign-in token (valid about four days). `$hidden` is only `password` and
  `remember_token`. `/user/verify` returns it too, so it also sits in the browser's store.
  ✅ **Fixed 2026-11-15:** `latest_token` is in `User::$hidden`. Nothing in `resources/js` read it.
- **FS2 [V]** `resources/views/emails/password-reset.blade.php:2,7` → the reset mail is titled "FAcheck" and its
  button goes to `https://facheck.com/PasswordForgotForm/{token}/{email}/…`. Reset tokens for this app are sent to
  another domain and the link cannot work here.
  ✅ **Fixed 2026-11-15:** the link is built from `APP_URL` (never the request's Host) and the mail no longer says
  "FAcheck". ⚠️ `APP_URL` must be the real address in production. The "Forgot password?" link on the site still
  leads to the dead contact form (FA1), so nobody can ask for this mail from the screen yet.
- **FS3 [V]** `can_send` is checked only by `v-if` in `FocusAir.vue:2491` and `HouseWayBill.vue:2356`. No
  controller reads it (it appears in `app/` only where the admin sets it), and the Consolidation manifest "Send"
  (`Consolidation.vue:471`) is not gated even on screen. A user barred from sending can still transmit.
  ✅ **Fixed 2026-11-15 (server side):** `Controller::abortUnlessMaySend()` answers 403 before anything is saved, on
  master and house create/update with `status: send` and on `manifest-send`. The Consolidation "Send" button has
  been hidden from a barred user since `021b43fe` (checked 2026-11-17).
- **FS4 [V]** `Auth/LoginController.php:41` vs `:74` → `latest_token` is overwritten before the portal check. A
  correct password on the wrong portal is refused, but has already ended the person's real session elsewhere.
  ✅ **Fixed 2026-11-15:** the token is written after the portal check. Tests for FS1–FS4:
  `tests/Feature/FrontendAuditSecurityTest.php`.
- **FS5 [V]** `freight/components/HelpAssistant.vue:269-277` → the help model's step text is given to driver.js as
  `description`, which driver.js writes with `innerHTML`. Model output is rendered as live HTML in the app, where
  the token is in `localStorage` (`core/services/jwt.service.js:5-11`).
- **FS6 [R]** `public/BlogPost.vue:46` (`v-html`) and `:199-201` (JSON-LD with the sanitiser off) → blog bodies
  from the admin editor are stored and rendered unsanitised; a title containing `</script>` breaks out of the
  JSON-LD. Only a superadmin can write one, so it is stored XSS behind one account — which FS1 makes worth having.
  ✅ **Fixed 2026-11-16:** a body is cleaned whenever it is saved (`Blog::setContentAttribute`,
  `App\Services\Blog\BlogBody`: only what the editor's toolbar can make), migration `2026_11_16_010000` cleans the
  rows already stored, and the JSON-LD writes `<` as `\u003c`. Test in `FrontendAuditSecurityTest`.
- **FS7 [R]** `layouts/admin/aside/Menu.vue:39-41`, `layouts/public/Header.vue:166-170` → these two logouts only
  clear `localStorage`; neither calls the server logout, so the token stays valid. Only
  `layouts/freight/ProfileMenu.vue` does it properly.
  ✅ **Fixed 2026-11-16:** both call the server's logout first (`/superadmin/logout`, `/user/logout`).
- **FS8 [R]** `Admin/SuperAdminController.php:32-39` + `admin/Account.vue` → the superadmin password change does
  not ask for the current password and accepts 4 characters (the screen says 6). User passwords set from
  `NewUsers` are also `min:4`.
  ✅ **Fixed 2026-11-16:** the change needs `current_password` and six characters; the screen has the new box and
  shows the server's reason. New users' passwords are `min:6`. Test in `FrontendAuditSecurityTest`.
- **FS9 [R]** `routes/web.php:30-33` → `/blog/{slug}` prints a draft's title, excerpt and image into the page head
  with no `published_at` check. The API route does 404 drafts.
  ✅ **Fixed 2026-11-16:** the route reads published posts only.
- **FS10 [R]** `freight/components/MailBodyFrame.vue:8-17` → inbound mail images load automatically (tracking
  pixels: the sender learns the mail was opened and from where). No script can run: the body is purified
  server-side and shown in a sandboxed frame.
  ✅ **Fixed 2026-11-16:** pictures fetched from the internet are blocked by the frame's own content policy until the
  reader chooses "Show pictures"; pictures carried in the mail always show. Asked again for each mail.
- **FS11 [P]** `router.js:117` + `welcome.blade.php:128-133` → the reset token and email are in the URL path and
  Google Analytics records the page location on every page.
  ✅ **Fixed 2026-11-16:** on the reset page analytics is given the bare page address, without the token, the email or
  the referrer. The token is still in the address bar and the browser's history: moving it out means a new link
  format in the mail.
- **FS12 [R]** `layouts/public/AuthModals.vue:208-224` → on the bare main domain the sign-in form still posts the
  password to `/api/login`, though `portalHosts.js` says it must only go to the chosen portal.
  ✅ **Fixed 2026-11-16:** with no portal chosen nothing is sent; the form says to choose the portal first.
- **FS13 [R]** `core/services/store/auth.module.js:98-104` → any 401 from `/{userType}/verify` purges the session,
  so a signed-in tenant who opens a `/superadmin/*` URL is signed out.
  ✅ **Fixed 2026-11-16:** the guard sends a person on a page for the other kind of account back to their own start,
  without checking them as that kind. Seen in the browser. Specs: `tests/js/securityLeftovers.spec.js`.
- **FS14 [R]** `public/JosephCard.vue`, `DeepanjanCard.vue` → two personal mobile numbers and emails are in the
  public bundle with no `noindex`. They are business cards by design: a decision to confirm.
  ✅ **Fixed 2026-11-16 (owner: keep them, ask search engines to skip them):** both cards carry
  `noindex, nofollow, noarchive, nosnippet` as a page tag and as an `X-Robots-Tag` header from the server
  (`routes/web.php`), for crawlers that run no script. Not listed in `robots.txt`, which would publish the two
  addresses. ⚠️ This keeps them out of search results; anyone holding the address can still open the card.

## 2. Fix first — airline waybill screens

- **FW1 [V]** `FocusAir.vue:3382-3404, 3414-3436`, `HouseWayBill.vue:3084-3142` → **the result of a Send is never
  shown.** On HTTP 200 the screen prints "-e-AWB Saved in database -Pass" and never reads `send_response`, which
  says whether the gateway accepted. Only a 422 with an `errors` object is displayed; the "complete it, then send
  again" 422, and any 403/404/500, leave the message empty. A refused message looks like a successful save.
  ✅ **Fixed 2026-11-16:** both screens read `send_response` through `core/services/waybillSend.js`: "Sent to the
  airline" only with a transaction id, otherwise "NOT SENT" with the server's reason; every refusal now shows a
  message. Seen in the browser for a 422 (field errors shown). ⚠️ The "Sent" and "NOT SENT" wording is covered by unit tests
  only: the dev company is not in testing mode, so a real Send would go to the live gateway.
- **FW2 [R]** `FocusAir.vue:3152-3156`, `HouseWayBill.vue:2952-2956` → the PDF layout links call `onSubmit()`
  without resetting `form.status`. After a Send, clicking a PDF link sends the waybill to the airline again. **[P]**
  Enter in any text input does the same, because "Send" is the form's first submit button.
  ✅ **Fixed 2026-11-16:** a PDF link sets `form.status = 'generate_pdf'` before saving, and Enter in a text box no
  longer submits (`airWayBillMixin.noEnterSubmit`). Specs: `tests/js/waybillSend.spec.js`. Checked in the browser on the
  master screen: a PDF link with the status left at `send` posted `generate_pdf`, and Enter in a text box was cancelled.
- **FW3 [V]** `Consolidation.vue:795` → `this.form.put(url, updateData)`: vform treats the second argument as
  axios config and sends the form's own data. Special-handling edits on a consolidation show a success toast and
  save nothing.
  ✅ **Fixed 2026-11-16:** the edit goes through `ApiService.put` with `updateData`. Not seen in a browser.
- **FW4 [R]** `Consolidation.vue:405, 432, 877-879` → the trash icon on a house row deletes nothing on the server;
  it removes a special-handling code from the form being edited.
  ✅ **Fixed 2026-11-16 (owner: "do it"):** the trash deletes that house waybill through the route that already
  existed and had no caller (`DELETE /user/house-way-bills/{id}`), after asking; the row goes, a refusal is said.
  Clicked through in the browser on a throwaway draft: No kept it, Yes deleted it (gone from the database).
- **FW5 [R]** `Consolidation.vue:679-682` → manifest Send has an empty `then` and no `catch`: no feedback either
  way, including the 502 for a refused manifest.
  ✅ **Fixed 2026-11-16:** a toast says sent, or NOT sent with the gateway's or server's reason; the button is
  hidden from a person who may not send (FS3) and cannot be double-clicked. Not seen in a browser.
- **FW6 [R]** Things that cannot be removed once saved, because the screen sends an empty list and the controller
  skips empty lists: special-handling codes (`AirwayBillController.php:664, 823`, `HousewayBillController.php:706`),
  OCI lines (`:613-617`, also two lines with one identifier collapse into one), the last other charge on a house,
  and the consignment on either form. The old rows come back on reload and go to the airline.
  ✅ **Fixed 2026-11-16:** on an update the list sent is the list: an empty one removes the rows, a request with no list
  leaves them; customs lines are replaced whole after every row is checked, so two with one identifier stay two.
  🔴 The tests for this found that **no other charge or customs line could be saved at all**: both controllers wrote
  `agent_id` to `other_charges_code` and `way_bill_custom_info`, which never had the column, so the save answered 500
  (both tables were empty on dev). Migration `2026_11_16_000000` adds it. Tests in `AirwayBillDraftTest` and
  `HouseWaybillDraftTest`.
- **FW7 [R]** `FocusAir.vue:2887-2891` → an airport the location table does not know becomes the text
  "undefined, undefined", passes validation and is saved as origin or destination. `HouseWayBill.vue` guards this.
  ✅ **Fixed 2026-11-16:** an unknown airport leaves the box as it was.
- **FW8 [R]** `FocusAir.vue:2906-2917`, `HouseWayBill.vue:2770-2781` → `flight_number.slice(0, 2)`: a
  three-letter carrier ("UAE501") is saved as carrier "UA", flight "E501".
  ✅ **Fixed 2026-11-16:** `airWayBillMixin.splitFlight`, used by both forms. A three-letter code leaves the carrier
  box EMPTY (it takes two characters), so the form refuses it instead of saving another airline.
- **FW9 [R]** `HouseWayBill.vue:2843` → the OCR's rate class loses its first two characters ("Q" becomes "");
  fixed in `FocusAir.vue:2980`. `HouseWayBill.vue:3230` → a house draft with no consignment row throws while
  loading and shows blank parties; `FocusAir.vue:3573` has the check.
  ✅ **Fixed 2026-11-16:** both.
- **FW10 [R]** `FocusAir.vue` `onSubmit` does not run `iataViolations()`; the house form does. A master can be
  sent with over-length name or address lines.
  ✅ **Fixed 2026-11-16:** checked before a Send; a draft may still be saved as it is.
- **FW11 [R]** `core/mixins/airWayBillMixin.js:178-204` → emptying a shipper, consignee or notify name replaces
  the whole address object: backspacing a name wipes address, city, country and phone.
  ✅ **Fixed 2026-11-16:** only the address-book pick is dropped.
- **FW12 [R]** `airWayBillMixin.js:281-291, 415-430` → OCI rows and other-charge rows share one `editIndex`.
  Click edit on one list, then add to the other, and a row is overwritten.
  ✅ **Fixed 2026-11-16:** customs lines have their own `ociEditIndex`.
- **FW13 [R]** `airWayBillMixin.js:493-501` → after an entry is added every text field is reset to `''`,
  including the units; the next piece row is stored with no unit and the XML's `?? 'CMT'` fallback does not catch
  an empty string.
  ✅ **Fixed 2026-11-16:** the units go back to `KGM` and `CMT`.
- **FW14 [R]** `core/config/awbMapping.js:124, 162` → drafts from the extraction panel carry `weight_code "K"` and
  `dimention_unit "CMT"`; the forms and the XML use KGM/LBR and CMQ/MTQ/FTQ/INQ.
  ✅ **Fixed 2026-11-16:** `KGM` and `MTQ` (the form's own default for a volume).
- **FW15 [R]** `FocusAir.vue:1337-1613` → about 18 inputs (issue signature, place and date, agent account, IATA
  code/CASS) are not part of the saved form; edits are discarded. The consignment Volume input and its unit
  (`:1029-1037`) also save nothing.
  ✅ **Fixed 2026-11-16 (owner's rule):** they are the BRANCH's details. Nothing is saved while typing; on **Send**,
  if a box differs from what the branch has, one question lists the changes: "Save for future shipments" writes them
  to the caller's own branch (`PUT /user/agent-info`, only for a person who may send) and then sends; "Don't save"
  puts the boxes back and sends with the branch's saved details; closing the question sends nothing. Both forms,
  through `airWayBillMixin` and `core/services/branchDetails.js`. Two participant boxes were bound to names that do
  not exist (`participate`, `participate_airport`) and always showed empty; they now show the branch's values.
  🔴 Found by its test: the IATA code and CASS were whole-number columns, so "0042" was stored and sent to the
  airline as 42. Migration `2026_11_16_020000` makes them text and puts the lost leading zeros back.
  Clicked through in the browser with the send itself blocked.
  ✅ **The consignment Volume box, removed 2026-11-17 (owner's decision):** the box, the unit list beside it (bound to
  nothing) and the always-empty "Vol." column of the consignments table are gone from both forms. The server never
  had anywhere to store the value and no message carried it. Total Volume, which is saved and sent, is untouched
  and still worked out from the pieces' dimensions. Seen in the browser on both forms: a consignment added, 16
  headings over 16 cells, Total Volume 0.40 m³ for two pieces of 100×50×40 cm; nothing was saved.
- **FW16 [R]** OCR mapping: the email goes into the Fax field (`FocusAir.vue:2942, 2965`); address cut to 30 and
  goods description to 70 characters without notice; a second import appends its dimension rows to the first
  document's (`:2996`); a missing shipper name or flight throws and abandons the rest of the mapping (`:2905-2992`).
  ✅ **Fixed 2026-11-17 (the code faults):** both forms read a document through one module,
  `core/services/documentMapping.js`. The email is no longer written into Fax (the form has no email box, so it is
  dropped); a missing name, address, description, flight list or dimension no longer throws; the goods of the last
  document (dimension rows, pieces, weights, rate, description) are emptied before the next is read; and when an
  address or description is cut, a notice that stays open says which and by how much. Tests in
  `documentMapping.spec.js`. Tried on both forms in the browser with made-up documents, nothing saved or sent.
  ⏸ Not checked against a real document: whether the reader's own output (field names, the 30 and 70 limits) is
  right for real waybills.
- **FW17 [R]** `HouseWayBill.vue:3381` → the master-number list asks for status `all`, which matches nothing: the
  list is always empty.
  ✅ **Fixed 2026-11-16:** on the server: `all` is every status, newest 100. Seen filled in the browser.
- **FW18 [V]** `components/DashboardHistoryModal.vue:71` → "Multipage PDF" for a consolidation points at a removed
  route; a tab flashes and closes.
  ✅ **Fixed 2026-11-16:** the link is removed.
- **FW19 [R]** "Send & Clear" (`FocusAir.vue:2493`, `HouseWayBill.vue:2358`) has the same handler as "Send".
  ✅ **Fixed 2026-11-16 (owner: remove it):** the button is gone from both forms. Seen in the browser.
  ⏸ Left with FW15 and FW16: what "Clear" should do, which of the 18 unsaved boxes should be saved, and the
  document-reading mapping each need a decision or a real document to test against. Specs for FW7–FW14 and FW18:
  `tests/js/waybillFormFixes.spec.js`; the master and house screens were loaded in the browser after the change.

## 3. Fix first — accounts and inbox

- **FM1 [R]** `freight/Billing.vue:791-793` → "Record a receipt" shows Outstanding in the bill's currency while
  "Place against it" is rupees, unlabelled. Typing 1000 against "USD 1,000.00" settles ₹1,000 of it.
  ✅ **Fixed 2026-11-16:** the server was checked: the figure typed IS rupees, turned into the bill's currency at the
  receipt day's rate (`ReceiptController::store`, GAPS #411). The column now reads "Rupees placed against it" and a
  foreign bill's row says so. Header seen in the browser; the demo data has no foreign bill to show the row note.
- **FM2 [V]** `freight/MoneyOut.vue:384, 511, 522` → the per-supplier commission and discount are never reset
  after a payment run. The next run with the same supplier arrives pre-filled with the last run's figures.
  ✅ **Fixed 2026-11-16:** cleared with the picks when the list reloads.
- **FM3 [V]** `freight/Financials.vue:1600-1603, 1632` → after posting a purchase voucher the drawer loads
  `/invoices/{id}/posting-preview`: an error, or the journal of an unrelated invoice with the same id.
  ✅ **Fixed 2026-11-16:** `loadPreview` asks `/vouchers/…` on the vouchers view.
- **FM4 [V]** `freight/CloseMonth.vue:371` → calls `this.messageFor`, which this page does not define. When a
  month's GST figures fail to load, the previous month's stay on screen while Download uses the new month.
  ✅ **Fixed 2026-11-16:** `messageFor` is defined, so the failure shows its reason and the stale figures are dropped.
- **FM5 [R]** `freight/MoneyIn.vue:75-81` + `Billing.vue:1026-1034` → stepping between "to bill", "drafts" and
  "issued" changes the header but not the list.
  ✅ **Fixed 2026-11-16:** `Billing.vue` watches the view and the stage's filter as one key. Seen in the browser: the
  three stages list 3, 2 and 42 rows, each matching its count.
- **FM6 [R]** `Financials.vue:1544` → the invoice Status filter is sent to the Bank register too, which reads it
  as a reconciliation status: an empty list with no visible filter to clear.
  ✅ **Fixed 2026-11-16:** Status goes only to the two invoice views that show the box.
- **FM7 [R]** Pick-lists filled from page one only (50 rows): receipt payer, bill client, shipment, partner
  (`Billing.vue:1148, 1312, 1352`), rate cards (`FinanceSettings.vue:542`), `ImportJob.vue:290`,
  `EntityPanel.vue:135`, `FocusSeaMaster.vue:489`, `CostSheet.vue:338`, `Financials.vue:1381`. Client or supplier
  number 51 cannot be chosen. Registers with no pager show only the newest 50 (`Financials.vue:1553`,
  `DirectoryTable.vue:502`, `ManifestFiling.vue:273`).
  ✅ **Fixed 2026-11-16 (clients and partners):** every client and partner pick-list asks for `per_page=500`
  (`format.js` `WHOLE_LIST`); `PartnerController::index` now takes `per_page`, 500 at most, as the client list did.
  ⏸ Left: the shipment list on a new bill is still the newest 50 (`JobController` holds someone else's uncommitted
  work) and a company with more than 500 clients needs a searched box.
  ✅ **Fixed 2026-11-17 (the three registers):** the manifest filings, the client and partner directories and the
  accounts lists (invoices, awaiting, vouchers, bank) ask for a page and draw "Previous / Page 2 of 3 / Next" under
  the list when there is a second page (`core/services/paging.js`, `components/Pager.vue`). A filter starts again
  from page one; a page past the end falls back to the last. Tests in `paging.spec.js`. Clicked through on the
  partner list against the server, two rows a page. The dev data has no list over 50 rows, so on the filings and
  accounts pages only "loads as before, no pager for one page" was seen.
- **FM8 [R]** `Billing.vue:982-984` → the "against which invoice" list for a new debit or credit note is taken
  from the rows on screen; on the notes tabs it is empty and the form cannot be submitted.
  ✅ **Fixed 2026-11-16:** the form asks the server for the issued invoices when it opens. Seen in the browser (32).
- **FM9 [R]** `Billing.vue:1053-1057` → the line total is rounded once; the server rounds amount, then tax, then
  adds. The total shown before saving can differ from the saved one by a paisa. `:1380` posts a floating-point sum
  (300.30000000000004) as a receipt amount.
  ✅ **Fixed 2026-11-16:** `format.js` `paise` rounds as PHP does; a line is amount, then tax, then the sum; the
  receipt amount and the placed total are rounded.
- **FM10 [R]** `Financials.vue:453` → "Unmatch" can never succeed (already noted in the backend audit).
  ✅ **Fixed 2026-11-16:** the button is gone; a matched line says it is in the ledger and is undone by a contra entry.
  The server route is left as it was.
- **FC1 [V]** `freight/components/ExtractionPanel.vue:1058-1063` + `JobInbox.vue:732-740` → the extraction panel
  is one instance that survives a change of conversation; its `jobId` watcher adds the new job's readings and
  clears nothing. Shipment A's waybill number and documents show under shipment B, and saving can write A's
  number onto B.
  ✅ **Fixed 2026-11-16:** the panel is keyed by the job, so each shipment gets its own; readings still running are
  picked up again from the server as before. Not seen in a browser.
- **FC2 [V]** `JobInbox.vue:1770` → one minute after a claim, an uncleared timer reopens the conversation, which
  closes the composer. A reply being typed is lost.
  ✅ **Fixed 2026-11-16:** the timer is kept, cleared, and skips the reopen while a reply is open or another
  conversation is showing.
- **FC3 [R]** Recipients are split on `,` or `;` by the input but on `,` only by the four senders
  (`JobInbox.vue:1259`, `NewMail.vue:83`, `Financials.vue:1510`, `Collections.vue:526`): "a@x.com; b@y.com" is
  sent as one address and refused.
  ✅ **Fixed 2026-11-16:** all seven senders split on `,` or `;`.
- **FC4 [R]** `freight/components/VisualReporter.vue:38, 211-222` → says "Screenshot: attached"; the image is
  never posted.
  ✅ **Fixed 2026-11-16 (wording):** it says the screenshot is for the reporter to check and is not sent. Sending it
  still waits on where images are stored (GAPS #35).
- **FC5 [R]** `ImportJob.vue:300-333` → empty fields are dropped before save, so a wrong IGM number or date cannot
  be cleared.
  ✅ **Fixed 2026-11-16:** an emptied IGM number, IGM date, handling agent, arrival, free days, storage date, and the
  delivery order's "given to" and fee are sent as null. Test in `ImportTest`. Flight and weight boxes still keep their
  stored value when blanked: those columns may not be empty.
- **FC6 [P]** `Collections.vue:481, 536` → follow-ups are always filed under the first branch. `JobInbox.vue:1722`
  → no "latest request wins" when two conversations are clicked quickly.
  ✅ **Fixed 2026-11-16:** the chasing mail's follow-up uses the branch chosen in "Log a chase"; the inbox drops the
  answer to any click but the latest. Specs for this group: `tests/js/accountsInboxFixes.spec.js`.

## 4. Public site and admin

- **FA1 [V]** `public/ContactUs.vue:123-388` → **all three contact forms are dead.** No input is bound, two
  buttons have no handler, and the quote form only writes to the console. Nothing calls `POST /api/contact`;
  every enquiry is lost.
  ✅ **Fixed 2026-11-16:** the three forms are bound and post to `/api/contact` (`core/services/contactForm.js`); what
  the server has no column for goes into the message, labelled. Seen working on the dev site. The note promising a
  confirmation email with a ticket number is gone: no such mail is sent.
- **FA2 [R]** "Forgot password?" (`PortalSignIn.vue:40` (wip), `AuthModals.vue:86`) links to the contact page.
  Nothing calls `POST /api/Forgotpassword`, so there is no self-service reset — and FS2 breaks the mail anyway.
  ✅ **Fixed 2026-11-16:** in `AuthModals.vue` the link asks for the reset mail for the address typed above.
  ⏸ `PortalSignIn.vue` still links to the contact page: it holds someone else's uncommitted work.
- **FA3 [V]** `public/DeepanjanCard.vue:426, 465` → the email is `@f16sefrieght.com` (misspelt). The email button
  and the downloaded contact card point at a domain the company does not own.
  ✅ **Fixed 2026-11-16:** both lines now read `@f16sefreight.com`. Specs for this batch:
  `tests/js/frontendAuditFixes.spec.js`.
- **FA4 [V]** `admin/Settings.vue:86` → calls `GET /superadmin/get-airline-list`, which does not exist. The
  airline list is always empty, so no airline notice can be added.
  ✅ **Fixed 2026-11-16:** the list comes from `/superadmin/airlines` (carriers with a two-letter code). Seen filled
  in the browser. Nothing in the app showed these notices to a user
  (`GET /user/get-notice` had no caller). ✅ **Shown 2026-11-16 (owner's call):** the master and house waybill forms
  show the notices filed under the airline the waybill prefix names, else the first flight's carrier, as plain text
  (`core/services/airlineNotice.js`, `tests/js/airlineNotice.spec.js`). Seen in the browser on the master form.
- **FA5 [R]** `admin/NewBlog.vue:24, 298` → "Update Blog" always sends `is_draft=0`: editing a draft publishes it.
  Takeaways cannot be cleared on edit (`:301-304`).
  ✅ **Fixed 2026-11-16:** on a draft the button reads "Publish Blog" (it always published; "Save as Draft" keeps a
  draft a draft), on a live post "Update Blog" and "Unpublish (save as draft)". An empty takeaways list is sent, so
  it clears. Test in `FrontendAuditSecurityTest`.
- **FA6 [R]** `Admin/SuperAdminController.php:187-246` + `admin/ClientShipments.vue:874-910` → when the stored XML
  is missing the server makes up a "simulated" XML and the viewer shows and downloads it as the shipment's message.
  ✅ **Fixed 2026-11-16:** no XML is made up; the server answers 404 with the reason, the viewer shows it and Copy
  and Download are disabled. Seen in the browser.
- **FA7 [R]** `admin/ClientShipments.vue` → CSV export is one page unless a date filter is set (`:752-774`); AWB
  search only asks the server when the page has no match (`:674-698`); changing filters keeps the old page number
  (`:724-744`).
  ✅ **Fixed 2026-11-16:** the CSV is always every shipment the filters match; the search always asks the server
  (seen in the browser); a filter change starts from page one.
  ✅ **The export is capped, 2026-11-17:** with no filter it was every waybill ever sent, loaded whole in one
  answer. It now carries at most `config('f16s.shipment_export_limit')` shipments (5,000), newest first; the
  answer says `truncated`, and the screen then warns "Only part of the list is in the file" with both counts and
  how to get the rest. `tests/Feature/ClientShipmentsTest.php` covers the cap; seen in the browser with a
  whole export (286 rows, no warning) and a capped one (the warning).
- **FA8 [R]** Saves that fail silently: `admin/NewUsers.vue:217-231`, `NewCompany.vue:170`, `NewBranch.vue:215`,
  `public/PasswordForgotForm.vue:47-53`, `admin/AllUsers.vue:163`, `adminList.mixin.js:38-58`.
  `EditSystemTemplate.vue:158` reports every failure as a coordinates error.
  ✅ **Fixed 2026-11-16:** each shows the server's reason (`core/services/serverMessage.js`); the admin lists say when
  loading or deleting failed.
- **FA9 [R]** `admin/Account.vue:122` pushes `/login` and `layouts/admin/Layout.vue:96` pushes `superadminlogin`;
  neither route exists. `admin/AirlineDirectory.vue:123` shows only the first 100 airlines.
  `admin/Settings.vue:90` deletes every notice for a carrier with no confirmation.
  ✅ **Fixed 2026-11-16:** both go to `/sign-in`; the directory asks for up to 500 airlines (the server took no
  `per_page`); the delete asks first. Specs for this group: `tests/js/adminFixes.spec.js`.
- **FA10 [R], found 2026-11-17 while testing** `admin/NewCompany.vue`, `NewBranch.vue` → opening the edit form with
  an id that does not exist (a deleted record, a mistyped address) threw in the console and showed an empty form
  whose button would send a save for nothing.
  ✅ **Fixed 2026-11-17:** both forms say "This company (branch) could not be found. It may have been deleted." and
  the button is off; a load the server refuses says why. Seen in the browser for both, with a real record and
  the "add" form unchanged.

## 5. Core: sign-in, errors, state

- **FK1 [V]** `main.js:77` + `auth.module.js:88-114` → `VERIFY_AUTH` does not return its promise, so the route
  guard does not wait for it. Protected pages mount and call the API before the token is checked, and a
  `POST /verify` goes out on every navigation.
  ✅ **Fixed 2026-11-16:** `VERIFY_AUTH` returns its promise and the guard waits for it. A passed check is reused for
  30 seconds and simultaneous checks share one request. Seen in the browser: one `/verify` per page load, none on
  the navigations after it.
- **FK2 [R]** `core/services/api.service.js` → no axios interceptor anywhere. An expired token on an ordinary call
  shows per-page errors until the next navigation.
  ✅ **Fixed 2026-11-16:** one response interceptor (`api.service.js` `sessionEnded`): a 401 on an ordinary call while a
  token is held signs the person out and opens the sign-in page with the server's reason. Not for the sign-in,
  verify, logout and password-reset calls, nor a platform route asked by a tenant. Seen in the browser.
- **FK3 [R]** `auth.module.js:98-107` → `.catch(({ response }) => response.status …)` throws when there is no
  response (offline, timeout). `:147-158` → sign-out leaves the old `Authorization` header on axios; with no token
  it sends `Bearer null`.
  ✅ **Fixed 2026-11-16:** no response no longer throws; `setHeader` removes the header when there is no token, and
  runs on sign-in and sign-out.
- **FK4 [R]** `core/services/me.js:8-19` → the shared `/me` promise is not cleared on sign-out; signing in as
  someone else within five seconds shows the previous person's profile.
  ✅ **Fixed 2026-11-16:** `forgetMe()` on sign-in and sign-out.
- **FK5 [R]** `main.js:62-69` → a signed-in user on the main domain is always sent to `/focus-air`, whatever their
  role. `Header.vue:41` shows the signed-in menu for any stored token, expired or not.
  ✅ **Fixed 2026-11-16 (first half):** the home page sends a signed-in person to their own start (`LANDING_ROUTE`),
  as sign-in does. Seen in the browser. ⏸ The public header still trusts a stored token until a call is refused.
- **FK6 [P]** `components/OcrUploadModal.vue:245-274` → polls every 0.8 s with no cap; any error stops it silently.
  ✅ **Fixed 2026-11-16:** it gives up after five minutes and says why; an error is said too.
- **FK7 [R]** `welcome.blade.php:72-73` → `vendor.css` and `common.css` are not versioned; after a deploy a browser
  can pair new scripts with old styles. `:44-47` advertises a `/search` page that does not exist.
  ✅ **Fixed 2026-11-16:** both go through `mix()` (hashed in a production build, as the scripts are); the search
  action is removed. Specs for this group: `tests/js/sessionHandling.spec.js`.

## 6. Speed

- **FP1 [R]** `webpack.mix.js:46-52` → one "common" chunk takes every module shared by two lazy pages, and the
  public home page loads it (2.3 MB in the development build).
  ✅ **Fixed 2026-11-16:** the heavy libraries that only some signed-in screens use each have a file of their own
  (`webpack.mix.js`): `editor` (the mail composer's rich-text editor, 945 KB), `pdf-support` (what pdf.js needs,
  315 KB), `datepicker` (212 KB), `alerts` (129 KB), beside `charts` from FP2. `common` went from 2.36 MB to 0.78 MB
  in the development build, and the public home page loads 0.76 MB of it where it loaded 2.32 MB. **No stylesheet
  changed:** `common.css` is the same size to the byte (the date picker's styles are kept in it on purpose, because
  the waybill forms restyle the picker in `app.css`, which must come after). Clicked through: the home page, the
  master waybill form (pickers drawn, `datepicker` loaded), the inbox composer (`editor` loaded, editor mounted),
  a PDF read in the page (`pdf-support` + `pdfjs`, a one-page file parsed), and two platform pages (`alerts`).
  ✅ **The app's own shared code, done 2026-11-17:** `common` is now styles only (`common.css`, as before), and
  our shared scripts go through a cache group with no name (`shared`), so webpack makes one file per group of
  pages that share the same code and a page loads only the ones it uses. Development build, scripts fetched
  beside the entry files: **home page 759 KB of `common` → 20 KB** (the blog titles); the billing screen 346 KB
  in all, the master waybill form 728 KB. The worry that stylesheets would move did not happen: `app.css`,
  `common.css` and `vendor.css` are **byte-identical** to the build before. Checked in the browser: every one of
  the 80 lazy route components loads, and the home page, master waybill form (date pickers drawn), inbox,
  billing and the platform's company list open with no console error.
  ✅ **Production build, checked 2026-11-17** (everything in FP1–FP3 together, which is what ships): `app.js` is
  121 KB and `vendor.js` 676 KB. The public home page loads **909 KB of script (256 KB compressed) and 1,208 KB of
  stylesheets (162 KB compressed)**, with no request to an outside font service. In the browser on that build: all
  80 lazy route components load; the home page, the board, the master waybill form (date pickers and icons drawn,
  no jQuery), the inbox, billing and the platform's company list (jQuery present, menu drawn) open with no console
  error. The development build was put back afterwards.
- **FP2 [R]** `main.js:8-52`, `core/plugins/metronic.js` → jQuery, apexcharts, vform and 33 theme modules are in the
  main bundle for every visitor; apexcharts is used by one component, jQuery by four pages, the 33 globals by nothing.
  ✅ **Fixed 2026-11-16 (theme scripts and charts):** the theme's scripts load with the platform admin layout, the
  only thing that uses them (they find each other through `window`, so the plugin is imported there, first); the
  chart library is registered in `FxChart.vue` and has its own `charts` chunk. `app.js` went from 1.48 MB to 0.70 MB
  in the development build. Seen in the browser: the admin layout with its menu, and a tenant page with no theme
  globals.
  ✅ **jQuery, done 2026-11-17:** it is out of the main bundle. The four pages that used it no longer do: the two
  waybill forms dim their Save and Send buttons through `submitButtons()` in the waybill mixin, and the two platform
  forms fade their "Saved" notice with `core/services/flash.js` (`tests/js/flash.spec.js`). The theme's own scripts
  still reach it through `window`, so it is imported in `core/plugins/metronic.js`, which loads with the platform
  admin layout only. `app.js` 711 KB → 431 KB in the development build. Seen in the browser: no jQuery on the home
  page or a tenant page; the waybill form's buttons dim and come back; on the platform, a company saved and its
  notice faded in and out. ⏸ vform stays in the main bundle (32 KB): sign-in and most forms use it.
- **FP3 [R]** `core/plugins/bootstrap-vue.js:5-7` → all of BootstrapVue plus the whole icon set; `App.vue:10-26` →
  seven font files and all of Font Awesome in a 2.7 MB render-blocking stylesheet.
  ✅ **Fixed 2026-11-16 (icons):** the app registers the 134 Bootstrap icons its source names, not all 1,371.
  `build/used-icons.js` writes the list (`core/plugins/bootstrap-icons.generated.js`) from the source before every
  compile: any quoted word that is an icon's name is kept, which covers the places that choose an icon at run time
  without following the code. `tests/js/usedIcons.spec.js` fails if the list is stale or a template names an icon
  that is not in it, and the pre-push hook runs it. **Production build:** `vendor.js` 1,250 KB → 676 KB (313 KB →
  187 KB gzipped). The development build shows no change: it never drops unused code. Font Awesome is down to the
  two families used (solid, regular); that saves under 1 KB, the font files were only ever fetched when used.
  Looked at on screen: home, contact, blog list, both waybill forms, consolidation, the board — no icon went blank.
  ⚠️ Not from this change: on the landing page's board mock-up (`HomeBoardScreen.vue`, someone's work in progress)
  two icons draw blank because this version of the icon library has no `send` (used twice); `ContactUs.vue` names
  `graph-up-arrow`, which it does not have either.
  **The main stylesheet, measured 2026-11-16/17.** `app.css` is 2.28 MB minified (241 KB gzipped) and the page waits
  for it. About three quarters of it (1.96 MB of 2.64 MB in the development build) styles classes that are written
  nowhere in `resources/js/src` or `resources/views`: the old theme's button variants (474 KB, 440 of it unused),
  its layout skins (`.aside-*`, `.header-*`, 300 KB), `.symbol-*`, `.hover-*`, and a spacing and colour utility set of
  4,743 classes of which 53 are used.
  ✅ **Step one, done 2026-11-17:** `style.vue.scss` no longer imports the stylesheets of 33 jQuery-era plugins the
  app does not have (fullcalendar, datatables, select2, summernote, …). 944 rules, 130 KB of the theme; `app.css`
  2,729 KB → 2,582 KB in the development build. Checked two ways: every removed rule was compared against every
  class the app and its libraries write (which is how `toastr` was kept: its `.toast` rules also style the app's own
  pop-up notices), and the computed style of every element was recorded on 16 screens before and compared after —
  15 identical element for element (11,300 elements); the landing page differs only in animations caught mid-way.
  ✅ **Step two, done 2026-11-17:** `build/purge-theme.js`, a PostCSS plugin of our own (no new dependency), drops a
  theme rule when the classes it needs are written nowhere. "Written" is spelt out at the top of that file: a word
  in our source; a word in a library we ship, all the way down the dependency tree; a prefix or an ending a script
  holds, joined to such a word; Bootstrap's grid. Only the theme's stylesheet (App.vue) goes through it; no page's
  own styles do. **Production `app.css`: 2,149 KB → 1,048 KB (227 KB → 131 KB gzipped).**
  How it was checked (`build/style-check/`): the computed style of every element was recorded on about 60 screens
  across the four portals before, and compared after; then pop-ups, notices, a validation error, an open calendar,
  an alert, the phone-width menus and five phone-width screens were each styled with both stylesheets in one sitting
  and compared. **Everything matches** except the landing page's own running animations. The comparison caught
  three real faults on the way, all fixed and pinned by `tests/js/purgeTheme.spec.js`: a class inside `:not()` was
  treated as required (the platform pages gained 15px at the top); the blog editor's toolbar classes come from a
  library our library depends on; BootstrapVue builds `navbar-toggler-icon` by adding an ending to a base name.
  ⚠️ What the check did not reach: screens that need data the demo does not have (a filled consolidation, a
  sea shipment, the tenant admin portal, the sales and boss dashboards), hover states, and print. If something looks
  wrong, `PURGE_THEME=off npx mix` builds the stylesheet whole, and `node build/purge-theme.js --why <class>` says
  why a class is kept or dropped.
  ✅ **Fonts, done 2026-11-17:** the font files themselves were never the cost (a browser fetches only the weight
  and script a page uses). The cost was an `@import` of Inter from Google Fonts in two card pages
  (`JosephCard.vue`, `DeepanjanCard.vue`): their styles land in the one shared stylesheet, so **every page of every
  portal made a render-blocking request to Google** before it could paint. Both imports are gone; App.vue now
  serves the three weights only Google was supplying (300, 800, 900) from our own site. Checked in the browser:
  no request to Google, and a line of text set in each weight measures the same width as before (within 0.03px).
  `tests/js/ownFonts.spec.js` fails if any page imports a font from an outside service again.
- **FP4 [R]** `public/blogData.js` (eight full articles) ships in the home page chunk to show four titles;
  `GET /get-public-blogs` returns every post with its full body.
  ✅ **Fixed 2026-11-16 (server half):** the public list no longer carries the bodies; the article is fetched with the
  article. ⏸ `blogData.js` in the home chunk is left: the home page files hold someone else's uncommitted work.
- **FP5 [R]** Waybill forms: the full airport list (about 20,000 rows) is made reactive and filtered twice per
  render; each form is one 2,400-line template re-rendered per keystroke; every update sends the record four times
  (`FocusAir.vue:3296, 3516-3532`).
  ✅ **Fixed 2026-11-16 (the airport list):** `location.cache.js` freezes the list, so Vue no longer makes ~20,000 rows
  reactive on every form. 🔴 Found on the way: `LocationController` cached the list for good **even when it was
  empty**, so a call made before the airports were loaded (or by a test run sharing the cache) left every waybill
  form with no airports; an empty list is no longer kept (`tests/Feature/LocationListCacheTest.php`). ⏸ The big
  template and the four saves per update are left: they belong with moving the shared waybill code into the mixin.

The committed `public/js` files are a development build, so absolute sizes overstate production.

## 7. Duplicates and dead code

- `FocusAir.vue` and `HouseWayBill.vue`: about 3,350 lines the same in each (two thirds). Not in the mixin and
  written twice: `processExtractedData`, `onSubmit`, `openForm`, the special-handling list (a third copy in
  `Consolidation.vue`), address book, lookups, the consignment modal, the styles. FW7, FW9 and FW10 are one copy
  fixed and the other not.
- `JosephCard.vue` / `DeepanjanCard.vue`: 1,608 of 1,634 lines identical.
- Two diverged `OcrUploadModal.vue`; OCR upload-and-poll written three times.
- `money()` in 8 files (and `format.js` already has `currency()`); `messageFor` and its variants in about 20 files
  (FM4 is one that forgot its copy); blob download 9 times; compose-and-send 4 times (FC3 comes from this).
- Dead: `core/config/i18n/*` (614 lines, imported nowhere); `layouts/public/Layout.vue`, `PageLoader.vue`,
  `store.js`, `profile.module.js` (demo data in the live store), `breadcrumbs.module.js`; `HomeFeatureGrid.vue`,
  `HomeStatsSection.vue`, `HomePartnersTicker.vue` (wip), `error/Error.vue`; in the waybill screens `converXml`
  (the only caller of the removed `/user/waybill/{id}`), `prepareFormDataForSubmission`, `validateFormFields`,
  `reloadPageWithContent` and a dozen smaller methods; the OTP modal that nothing opens; `UPDATE_PASSWORD`
  (calls a route that does not exist).

> **2026-11-16: first pass.**
> **Removed (each checked to have no caller anywhere in `resources/js/src` or `tests/js`):** `core/config/i18n/*`,
> `layouts/public/Layout.vue`, `components/PageLoader.vue` and its commented-out references, `store/store.js`,
> `profile.module.js`, `breadcrumbs.module.js`, `error/Error.vue`; in the auth store `UPDATE_PASSWORD`, `SET_PASSWORD`,
> `REGISTER`, `UPDATE_Source`, `SAVE_FORM_DATA` and `getFormData`; in the waybill screens `converXml`,
> `prepareFormDataForSubmission`, `validateFormFields`, `reloadPageWithContent`, `issueDateChange` and the modal and
> hover stubs (`handleOk`, `toggleModal`, `showModal`, `hideModal`, `mouseover`, `mouseleave`); in `Consolidation.vue`
> also `updateform`, `getAgent`, `getCurrentUser`, `handleRadioChange`; in the mixin `calculateTotalCharges`,
> `displayModal`. About 1,000 lines.
> **Merged:** `messageFor` / `readable` and the same logic written inline, in 36 pages, now call
> `core/services/serverMessage.js` (`{ all: true }` where a page listed every field's complaint); `money()` in 8 pages
> calls `format.js` `inr`. The wording of a few fallbacks changes: with no answer from the server every page now says
> it could not be reached, and a validation failure shows the field's message where some showed Laravel's summary.
> **Moved into `airWayBillMixin.js`:** the ten methods that were the same in `FocusAir.vue` and `HouseWayBill.vue`
> (`handleSaveAndGeneratePDF`, `getLocation`, `fetchAllAddressBook`, `addManualCode`, `deleteSplCode`,
> `handleDateChange`, `validateNumericInput`, the two email handlers; `onSelect` was already there and defined twice more).
> **Left:** `processExtractedData`, `onSubmit`, `openForm`, `onAWBInput`, `getAgent`, `isGeneratePdf` and the three
> `fill…Details` differ between the two forms (60 to 120 lines each for the big three), so merging them is a change
> of behaviour to be made with a real waybill of each kind to hand; the templates and styles; the two business
> cards (FS14 first); the two `OcrUploadModal.vue`; blob download (9) and compose-and-send (4); the OTP modal
> (`Header.vue` holds someone else's work); `HomeFeatureGrid.vue`, `HomeStatsSection.vue`, `HomePartnersTicker.vue`
> (the home page is someone's work in progress); `JobBoard.vue`'s own `readable` (same reason).

> **2026-11-17: file downloads.** Handing a file to the browser was written out in eleven pages; it is
> `core/services/download.js` now (`saveFile`, `showFile`). `MailFiling.vue` and `MoneyOut.vue` freed the file the
> moment the link was clicked, which some browsers treat as cancelling the download: every page now frees it 30
> seconds later. Tests in `download.spec.js`. Run in the browser against the server, with the save itself held
> back: the ageing, day book, billing and profitability exports. Not clicked: the other seven. Left as they are:
> the attachment and document viewers in `JobInbox.vue` and `FocusSeaMaster.vue` and the two business cards, which
> do something different with the file. The icon list lost `download`: the only place the word was quoted was the
> removed code.

## 8. Tests

40 jest specs. About 32 run real modules or mount real components. Six assert on source text read from disk, so
they pass or fail on wording, not behaviour (`airlineDeductionWords`, `generatePdfPanel`, `partyColumns`,
`routingTableWidth`, `textareaHeight`, `templateConditions`). Nothing under `pages/admin` is tested; in `public`
only the sign-in error banner. No test for the route guards, the auth store, the contact form, password reset or
the blog pages. Nothing runs the specs automatically.

> **2026-11-16.** Now 54 specs. Added, each one RUN, not read:
> `authGuard.spec.js` (the route guard, lifted out of `main.js` into `core/services/authGuard.js` so it can be called:
> public pages, the home page when signed in, waiting for the session check, the wrong kind of account);
> `authStore.spec.js` (the real store against a pretend server: checking a session, one check per load, a 401, no
> answer, sign-in, sign-out); `passwordReset.spec.js` (the page mounted: a good and a bad link, a reset, a refusal);
> `blogPost.spec.js` (an article mounted: its body and takeaways, the offline fallback, the search-engine block);
> `adminScreens.spec.js` (the airline directory and the airline notices mounted, and the list helper every admin
> table shares); `contactForm.spec.js` came with FA1.
> **Still true:** the six older specs named above read source text, and so do most of the specs written for this
> audit's fixes inside the big single-file pages (`frontendAuditFixes`, `waybillFormFixes`, `accountsInboxFixes`,
> parts of `adminFixes`, `sessionHandling`, `securityLeftovers`): those pages do not mount in jest as they are.
> The other admin pages are untested. **The specs now run before every push** (owner's call, 2026-11-16): the
> pre-push hook runs `jest` first and a failure stops the push (`SKIP_TESTS=1 git push` skips it once). ⚠️ The hook
> is in `.git/hooks`, which git does not carry: it is on this machine only. **2026-11-17:** GitHub now runs the same
> specs on every push and pull request (`.github/workflows/frontend-tests.yml`), wherever the push comes from. The
> server suite is not run there: it needs MySQL and Redis and takes about 12 minutes.

## 9. Checked and found fine

- Every admin and tenant API group is guarded on the server; the client guards are convenience only.
- Mail bodies are purified server-side and shown in a sandboxed frame without scripts; subjects, senders and AI
  drafts are plain text. Attachments are served so they cannot run in the page.
- All 258 API calls in the freight screens resolve to an existing route with the right method. No screen calls the
  removed company or branch delete, `GET /user`, or the report routes.
- Dates go to the server as `YYYY-MM-DD`. Totals under the billing, GST, ageing and payments registers come from
  the server. Post, pay, send, finalise and void buttons are disabled while busy (a few minor ones are not).
- The bulk-mail limit of 25 and the page-size caps are handled by the screens.
- Password reset on the server: hashed one-time token, 30 minutes, same answer for unknown addresses.

## 10. Suggested order

1. FS1–FS4 (server-side, small): hide `latest_token`, fix the reset mail, enforce `can_send`, move the token write
   after the portal check.
2. FW1–FW3: show the gateway's answer, stop the accidental re-send, fix the consolidation save.
3. FA1–FA3: the contact forms, forgot-password, the misspelt email.
4. FM1–FM4 and FC1–FC2: the money and inbox defects.
5. FS5–FS8, FK1–FK3.
6. FW4–FW19, ideally after moving the shared waybill code into the mixin so each fix lands once.
7. Speed, then duplicates and dead code.
