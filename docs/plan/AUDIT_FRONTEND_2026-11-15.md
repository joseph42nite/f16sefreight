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
  master and house create/update with `status: send` and on `manifest-send`. Still open on screen: the Consolidation
  "Send" button is shown to a barred user, who now gets the 403.
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
- **FS11 [P]** `router.js:117` + `welcome.blade.php:128-133` → the reset token and email are in the URL path and
  Google Analytics records the page location on every page.
- **FS12 [R]** `layouts/public/AuthModals.vue:208-224` → on the bare main domain the sign-in form still posts the
  password to `/api/login`, though `portalHosts.js` says it must only go to the chosen portal.
- **FS13 [R]** `core/services/store/auth.module.js:98-104` → any 401 from `/{userType}/verify` purges the session,
  so a signed-in tenant who opens a `/superadmin/*` URL is signed out.
- **FS14 [R]** `public/JosephCard.vue`, `DeepanjanCard.vue` → two personal mobile numbers and emails are in the
  public bundle with no `noindex`. They are business cards by design: a decision to confirm.

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
  ⏸ Left: what the trash should do (delete the house, or take it off this master) is the owner's call.
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
- **FW16 [R]** OCR mapping: the email goes into the Fax field (`FocusAir.vue:2942, 2965`); address cut to 30 and
  goods description to 70 characters without notice; a second import appends its dimension rows to the first
  document's (`:2996`); a missing shipper name or flight throws and abandons the rest of the mapping (`:2905-2992`).
- **FW17 [R]** `HouseWayBill.vue:3381` → the master-number list asks for status `all`, which matches nothing: the
  list is always empty.
  ✅ **Fixed 2026-11-16:** on the server: `all` is every status, newest 100. Seen filled in the browser.
- **FW18 [V]** `components/DashboardHistoryModal.vue:71` → "Multipage PDF" for a consolidation points at a removed
  route; a tab flashes and closes.
  ✅ **Fixed 2026-11-16:** the link is removed.
- **FW19 [R]** "Send & Clear" (`FocusAir.vue:2493`, `HouseWayBill.vue:2358`) has the same handler as "Send".
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
  work), a company with more than 500 clients needs a searched box, and the three registers still have no pager.
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
- **FA5 [R]** `admin/NewBlog.vue:24, 298` → "Update Blog" always sends `is_draft=0`: editing a draft publishes it.
  Takeaways cannot be cleared on edit (`:301-304`).
- **FA6 [R]** `Admin/SuperAdminController.php:187-246` + `admin/ClientShipments.vue:874-910` → when the stored XML
  is missing the server makes up a "simulated" XML and the viewer shows and downloads it as the shipment's message.
- **FA7 [R]** `admin/ClientShipments.vue` → CSV export is one page unless a date filter is set (`:752-774`); AWB
  search only asks the server when the page has no match (`:674-698`); changing filters keeps the old page number
  (`:724-744`).
- **FA8 [R]** Saves that fail silently: `admin/NewUsers.vue:217-231`, `NewCompany.vue:170`, `NewBranch.vue:215`,
  `public/PasswordForgotForm.vue:47-53`, `admin/AllUsers.vue:163`, `adminList.mixin.js:38-58`.
  `EditSystemTemplate.vue:158` reports every failure as a coordinates error.
- **FA9 [R]** `admin/Account.vue:122` pushes `/login` and `layouts/admin/Layout.vue:96` pushes `superadminlogin`;
  neither route exists. `admin/AirlineDirectory.vue:123` shows only the first 100 airlines.
  `admin/Settings.vue:90` deletes every notice for a carrier with no confirmation.

## 5. Core: sign-in, errors, state

- **FK1 [V]** `main.js:77` + `auth.module.js:88-114` → `VERIFY_AUTH` does not return its promise, so the route
  guard does not wait for it. Protected pages mount and call the API before the token is checked, and a
  `POST /verify` goes out on every navigation.
- **FK2 [R]** `core/services/api.service.js` → no axios interceptor anywhere. An expired token on an ordinary call
  shows per-page errors until the next navigation.
- **FK3 [R]** `auth.module.js:98-107` → `.catch(({ response }) => response.status …)` throws when there is no
  response (offline, timeout). `:147-158` → sign-out leaves the old `Authorization` header on axios; with no token
  it sends `Bearer null`.
  ✅ **Fixed 2026-11-16 (first half):** no response no longer throws. The stale header on sign-out is left.
- **FK4 [R]** `core/services/me.js:8-19` → the shared `/me` promise is not cleared on sign-out; signing in as
  someone else within five seconds shows the previous person's profile.
- **FK5 [R]** `main.js:62-69` → a signed-in user on the main domain is always sent to `/focus-air`, whatever their
  role. `Header.vue:41` shows the signed-in menu for any stored token, expired or not.
- **FK6 [P]** `components/OcrUploadModal.vue:245-274` → polls every 0.8 s with no cap; any error stops it silently.
- **FK7 [R]** `welcome.blade.php:72-73` → `vendor.css` and `common.css` are not versioned; after a deploy a browser
  can pair new scripts with old styles. `:44-47` advertises a `/search` page that does not exist.

## 6. Speed

- **FP1 [R]** `webpack.mix.js:46-52` → one "common" chunk takes every module shared by two lazy pages, and the
  public home page loads it (2.3 MB in the development build).
- **FP2 [R]** `main.js:8-52`, `core/plugins/metronic.js` → jQuery, apexcharts, vform and 33 theme modules are in the
  main bundle for every visitor; apexcharts is used by one component, jQuery by four pages, the 33 globals by nothing.
- **FP3 [R]** `core/plugins/bootstrap-vue.js:5-7` → all of BootstrapVue plus the whole icon set; `App.vue:10-26` →
  seven font files and all of Font Awesome in a 2.7 MB render-blocking stylesheet.
- **FP4 [R]** `public/blogData.js` (eight full articles) ships in the home page chunk to show four titles;
  `GET /get-public-blogs` returns every post with its full body.
- **FP5 [R]** Waybill forms: the full airport list (about 20,000 rows) is made reactive and filtered twice per
  render; each form is one 2,400-line template re-rendered per keystroke; every update sends the record four times
  (`FocusAir.vue:3296, 3516-3532`).

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

## 8. Tests

40 jest specs. About 32 run real modules or mount real components. Six assert on source text read from disk, so
they pass or fail on wording, not behaviour (`airlineDeductionWords`, `generatePdfPanel`, `partyColumns`,
`routingTableWidth`, `textareaHeight`, `templateConditions`). Nothing under `pages/admin` is tested; in `public`
only the sign-in error banner. No test for the route guards, the auth store, the contact form, password reset or
the blog pages. Nothing runs the specs automatically.

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
