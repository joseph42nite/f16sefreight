<template>
  <div>
    <!--
      ⚠️ Inside Money in this page is a STAGE, not a page: its own title and view bar would be a second set of
      navigation under the pipeline, which is how a merge ends up looking like two screens stacked.
    -->
    <header v-if="!embedded" class="fx-page-head">
      <h1 class="fx-page-title">Billing</h1>
      <p class="fx-page-sub">
        {{ subtitleForView }}
        <router-link to="/financials">Financials →</router-link>
      </p>
    </header>

    <!--
      The billing desk (user, 2026-09-19), one section per document as Logi-Sys lays it out. They share a table, a
      client and a shipment, so they share a register and a drawer; what differs is who each is addressed to and what
      it does to the ledger, and that is exactly what the drawer shows.
    -->
    <div v-if="!embedded" class="fx-toolbar fx-financials__views">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="fx-btn"
        :class="{ 'fx-btn--primary': view === v.key }"
        @click="showView(v.key)"
      >{{ v.label }}</button>
    </div>

    <!-- ── The register, for one document type or all of them ────────────── -->
    <template v-if="isRegister">
      <div class="fx-toolbar">
        <label v-if="branches.length > 1" class="fx-field">
          <span class="fx-field__label">Location</span>
          <select v-model="filters.agent_id" class="fx-input" @change="load">
            <option :value="null">All branches</option>
            <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
          </select>
        </label>

        <label class="fx-field">
          <span class="fx-field__label">From</span>
          <input v-model="filters.from" type="date" class="fx-input" @change="load" />
        </label>
        <label class="fx-field">
          <span class="fx-field__label">To</span>
          <input v-model="filters.to" type="date" class="fx-input" @change="load" />
        </label>

        <label class="fx-field">
          <span class="fx-field__label">Organization or number</span>
          <input v-model="filters.q" class="fx-input" placeholder="client, agent, INV-…, job" @keyup.enter="load" />
        </label>

        <label class="fx-field">
          <span class="fx-field__label">Status</span>
          <select v-model="filters.status" class="fx-input" @change="load">
            <option value="">All</option>
            <option v-for="s in STATUSES" :key="s" :value="s">{{ s.replace(/_/g, " ") }}</option>
          </select>
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Currency</span>
          <select v-model="filters.currency" class="fx-input" @change="load">
            <option value="">All</option>
            <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Raised by</span>
          <select v-model="filters.created_by" class="fx-input" @change="load">
            <option :value="null">Anyone</option>
            <option v-for="u in raisedBy" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Sort on</span>
          <select v-model="filters.sort" class="fx-input" @change="load">
            <option value="date">Date</option>
            <option value="transaction_no">Transaction no.</option>
            <option value="organization">Organization</option>
            <option value="amount">Amount</option>
          </select>
        </label>

        <label class="fx-checkbox">
          <input v-model="filters.outstanding" type="checkbox" @change="load" />
          Outstanding only
        </label>
        <!-- Logi-Sys calls this "Exclude Reverse Txns": the notes that give money back. -->
        <label v-if="view === 'all'" class="fx-checkbox">
          <input v-model="filters.exclude_credit_notes" type="checkbox" @change="load" />
          Exclude credit notes
        </label>
      </div>

      <!-- Multiple Bill Printing: whatever is ticked, printed or mailed in one go. -->
      <div class="fx-toolbar">
        <button v-if="canPost" class="fx-btn fx-btn--primary" @click="openRaise(newDocumentType)">
          New {{ typeLabel(newDocumentType).toLowerCase() }}
        </button>
        <button class="fx-btn" :disabled="busy || !rows.length" @click="toggleAll">
          {{ allChosen ? "Clear selection" : "Check all" }}
        </button>
        <button class="fx-btn" :disabled="busy || !chosen.length" @click="printBills">
          {{ busy ? "Working…" : `Print ${chosen.length || ""}`.trim() }}
        </button>
        <button v-if="canPost" class="fx-btn" :disabled="busy || !chosen.length" @click="mailBills">Send mail</button>
        <button class="fx-btn" :disabled="busy" @click="exportCsv">Data export</button>
      </div>

      <p v-if="loading" class="fx-muted">Loading…</p>
      <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
      <p v-else-if="!rows.length" class="fx-muted">No document matches.</p>

      <template v-else>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Trans No.</th>
              <th scope="col">Date</th>
              <th v-if="view === 'all'" scope="col">Type</th>
              <th scope="col">Organization</th>
              <th scope="col">Shipment</th>
              <th scope="col">Curr</th>
              <th class="fx-num" scope="col">Amount</th>
              <th class="fx-num" scope="col">Amount (INR)</th>
              <th class="fx-num" scope="col">Outstanding</th>
              <th scope="col">Status</th>
              <th scope="col">Narration</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="'d-' + row.id"
              class="is-clickable"
              :class="{ 'is-selected': (document && document.id === row.id) || picked[row.id] }"
              tabindex="0"
              @click="open(row)"
              @keydown.enter="open(row)"
            >
              <td @click.stop>
                <input v-model="picked[row.id]" type="checkbox" :aria-label="'Choose ' + row.invoice_no" />
              </td>
              <td class="identifier">{{ row.invoice_no }}</td>
              <td><Figure :value="row.document_date" kind="date" /></td>
              <td v-if="view === 'all'">{{ typeLabel(row.type) }}</td>
              <td>{{ row.organization || "—" }}</td>
              <td class="identifier">{{ row.job_no || "—" }}</td>
              <td>{{ row.currency }}</td>
              <td class="fx-num"><Figure :value="row.amount" kind="currency" :currency-code="row.currency || 'INR'" /></td>
              <td class="fx-num"><Figure :value="row.amount_inr" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="row.outstanding_inr" kind="currency" currency-code="INR" /></td>
              <td><StatusChip :value="row.status" /></td>
              <td class="fx-muted">{{ row.narration || "—" }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td :colspan="view === 'all' ? 8 : 7" class="fx-num"><strong>{{ totals.count }} document(s)</strong></td>
              <td class="fx-num"><strong><Figure :value="totals.amount_inr" kind="currency" currency-code="INR" /></strong></td>
              <td class="fx-num"><strong><Figure :value="totals.outstanding_inr" kind="currency" currency-code="INR" /></strong></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
        <p class="fx-muted">
          Totalled in INR at each document's own exchange rate.
          <span v-if="totals.credited_inr">
            Credit notes count against the total; {{ money(totals.credited_inr) }} has been credited back.
          </span>
        </p>
      </template>

      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      <p v-if="mailResult" class="fx-notice" role="status">
        {{ mailResult.sent.length }} sent from {{ mailResult.from }}<span v-if="mailResult.skipped.length">;
        {{ mailResult.skipped.length }} not sent: {{ mailResult.skipped.map((s) => s.invoice_no + " — " + s.why).join("; ") }}</span>.
      </p>
    </template>

    <!-- ── Receipts ──────────────────────────────────────────────────────── -->
    <template v-else-if="view === 'receipts'">
      <div class="fx-toolbar">
        <button v-if="canPost" class="fx-btn fx-btn--primary" @click="openReceipt">Record a receipt</button>
      </div>

      <p v-if="loading" class="fx-muted">Loading…</p>
      <p v-else-if="!receipts.length" class="fx-muted">No receipt has been recorded.</p>
      <table v-else class="fx-table">
        <thead>
          <tr>
            <th scope="col">Receipt no.</th>
            <th scope="col">Date</th>
            <th scope="col">Organization</th>
            <th scope="col">Mode</th>
            <th scope="col">Reference</th>
            <th class="fx-num" scope="col">Amount</th>
            <th class="fx-num" scope="col">Placed</th>
            <th class="fx-num" scope="col">On account</th>
            <th scope="col">Settles</th>
            <th scope="col">Posted</th>
            <th v-if="canPost" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in receipts" :key="'r-' + r.id">
            <td class="identifier">{{ r.receipt_no }}</td>
            <td><Figure :value="r.receipt_date" kind="date" /></td>
            <td>{{ r.organization || "—" }}</td>
            <td>{{ (r.mode || "").replace(/_/g, " ") }}</td>
            <td class="identifier">{{ r.reference || "—" }}</td>
            <td class="fx-num"><Figure :value="r.amount" kind="currency" :currency-code="r.currency || 'INR'" /></td>
            <td class="fx-num"><Figure :value="r.allocated" kind="currency" currency-code="INR" /></td>
            <td class="fx-num"><Figure :value="r.unallocated" kind="currency" currency-code="INR" /></td>
            <td class="fx-muted">{{ r.allocations.map((a) => a.invoice_no).join(", ") || "Not placed yet" }}</td>
            <td><StatusChip :value="r.is_posted ? 'posted' : 'unposted'" /></td>
            <td v-if="canPost" class="fx-row-actions">
              <button v-if="!r.is_posted" class="fx-btn" :disabled="busy" @click="postReceipt(r)">Post</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
    </template>

    <!-- ── E-Invoice register ────────────────────────────────────────────── -->
    <template v-else-if="view === 'einvoice'">
      <p class="fx-muted">{{ eInvoiceNote }}</p>
      <p v-if="loading" class="fx-muted">Loading…</p>
      <p v-else-if="!eInvoices.length" class="fx-muted">Nothing is numbered yet.</p>
      <table v-else class="fx-table">
        <thead>
          <tr>
            <th scope="col">Trans No.</th>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Organization</th>
            <th scope="col">Their GSTIN</th>
            <th class="fx-num" scope="col">Amount</th>
            <th scope="col">IRN</th>
            <th scope="col">Where it stands</th>
            <th v-if="canPost" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in eInvoices" :key="'e-' + e.id">
            <td class="identifier">{{ e.invoice_no }}</td>
            <td><Figure :value="e.document_date" kind="date" /></td>
            <td>{{ typeLabel(e.type) }}</td>
            <td>{{ e.organization || "—" }}</td>
            <td class="identifier">{{ e.gst_no || "—" }}</td>
            <td class="fx-num"><Figure :value="e.grand_total" kind="currency" :currency-code="e.currency || 'INR'" /></td>
            <td class="fx-muted">{{ e.irn ? e.irn.slice(0, 16) + "…" : "—" }}</td>
            <td>
              <span v-if="e.state === 'generated'">Registered {{ e.ack_no ? "(ack " + e.ack_no + ")" : "" }}</span>
              <span v-else-if="e.state === 'pending'">Waiting for the portal</span>
              <span v-else class="fx-muted">Not required — they have no GSTIN</span>
            </td>
            <td v-if="canPost" class="fx-row-actions">
              <button v-if="e.state === 'pending'" class="fx-btn" @click="irnFor = { id: e.id, invoice_no: e.invoice_no, irn: '', ack_no: '' }">
                Record the IRN
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
    </template>

    <!-- ── One document, opened ──────────────────────────────────────────── -->
    <FxDrawer
      :open="!!document"
      :title="document ? (document.invoice_no || 'Draft') : ''"
      :subtitle="document ? document.label + (document.organization ? ' — ' + document.organization.name : '') : ''"
      :tabs="DOC_TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="document = null"
    >
      <template #meta>
        <dl v-if="document" class="fx-defs">
          <dt>Date</dt>
          <dd><Figure :value="document.document_date" kind="date" /></dd>
          <dt>Due</dt>
          <dd><Figure v-if="document.due_date" :value="document.due_date" kind="date" /><span v-else class="fx-muted">—</span></dd>
          <dt>Shipment</dt>
          <dd class="identifier">{{ document.job ? document.job.execution_job_no : "—" }}</dd>
          <dt>Total</dt>
          <dd><Figure :value="document.grand_total" kind="currency" :currency-code="document.currency || 'INR'" /></dd>
          <dt>Status</dt>
          <dd><StatusChip :value="document.status" /> <StatusChip :value="document.is_posted ? 'posted' : 'unposted'" /></dd>
        </dl>
      </template>

      <template v-if="document">
        <!-- ── The document itself ───────────────────────────────────────── -->
        <section v-if="tab === 'document'" class="fx-section">
          <p v-if="document.parent" class="fx-muted">
            Raised against <strong>{{ document.parent.invoice_no }}</strong>
            ({{ money(document.parent.grand_total) }}).
            <span v-if="document.reason">Reason: {{ document.reason }}</span>
          </p>
          <p v-else-if="document.reason" class="fx-muted">Reason: {{ document.reason }}</p>
          <p v-if="document.credit_override_reason" class="fx-notice" role="status">
            Issued over the client's credit limit: {{ document.credit_override_reason }}
          </p>

          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">HSN/SAC</th>
                <th class="fx-num" scope="col">Qty</th>
                <th class="fx-num" scope="col">Rate</th>
                <th class="fx-num" scope="col">Amount</th>
                <th class="fx-num" scope="col">Tax %</th>
                <th class="fx-num" scope="col">Net</th>
                <th v-if="can.edit" scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="'i-' + item.id">
                <template v-if="can.edit && editingLine === item.id">
                  <td><input v-model="lineDraft.description" class="fx-input" /></td>
                  <td><input v-model="lineDraft.hsn_sac_code" class="fx-input" /></td>
                  <td><input v-model.number="lineDraft.quantity" type="number" step="0.001" class="fx-input fx-num" /></td>
                  <td><input v-model.number="lineDraft.rate" type="number" step="0.01" class="fx-input fx-num" /></td>
                  <td class="fx-num">{{ money(lineDraft.quantity * lineDraft.rate) }}</td>
                  <td><input v-model.number="lineDraft.tax_percentage" type="number" step="0.01" class="fx-input fx-num" /></td>
                  <td class="fx-num">{{ money(lineNet(lineDraft)) }}</td>
                  <td class="fx-row-actions">
                    <button class="fx-btn fx-btn--primary" :disabled="busy" @click="saveLine(item.id)">Save</button>
                    <button class="fx-btn fx-btn--ghost" @click="editingLine = null">Cancel</button>
                  </td>
                </template>
                <template v-else>
                  <td>{{ item.description }}</td>
                  <td>{{ item.hsn_sac_code || "—" }}</td>
                  <td class="fx-num">{{ trim(item.quantity) }}</td>
                  <td class="fx-num"><Figure :value="item.rate" kind="currency" :currency-code="document.currency || 'INR'" /></td>
                  <td class="fx-num"><Figure :value="item.amount" kind="currency" :currency-code="document.currency || 'INR'" /></td>
                  <td class="fx-num">{{ trim(item.tax_percentage) }}</td>
                  <td class="fx-num"><Figure :value="item.net_amount" kind="currency" :currency-code="document.currency || 'INR'" /></td>
                  <td v-if="can.edit" class="fx-row-actions">
                    <button class="fx-btn" @click="editLine(item)">Edit</button>
                    <button class="fx-btn fx-btn--ghost" :disabled="busy || items.length < 2" @click="deleteLine(item)">Remove</button>
                  </td>
                </template>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="fx-num"><strong>Total</strong></td>
                <td class="fx-num"><Figure :value="document.subtotal" kind="currency" :currency-code="document.currency || 'INR'" /></td>
                <td class="fx-num"><Figure :value="document.tax_amount" kind="currency" :currency-code="document.currency || 'INR'" /></td>
                <td class="fx-num"><strong><Figure :value="document.grand_total" kind="currency" :currency-code="document.currency || 'INR'" /></strong></td>
                <td v-if="can.edit"></td>
              </tr>
            </tfoot>
          </table>

          <template v-if="can.edit">
            <h3 class="fx-section__title">Add a line</h3>
            <div class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">Description</span>
                <input v-model="newLine.description" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">HSN/SAC</span>
                <input v-model="newLine.hsn_sac_code" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Qty</span>
                <input v-model.number="newLine.quantity" type="number" step="0.001" class="fx-input fx-num" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Rate</span>
                <input v-model.number="newLine.rate" type="number" step="0.01" class="fx-input fx-num" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Tax %</span>
                <input v-model.number="newLine.tax_percentage" type="number" step="0.01" class="fx-input fx-num" />
              </label>
              <button class="fx-btn" :disabled="busy || !newLine.description || !newLine.rate" @click="addLine">Add</button>
            </div>

            <h3 class="fx-section__title">Header</h3>
            <div class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">Document date</span>
                <input v-model="header.document_date" type="date" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Due date</span>
                <input v-model="header.due_date" type="date" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Currency</span>
                <input v-model="header.currency" maxlength="3" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Exchange rate</span>
                <input v-model.number="header.exchange_rate" type="number" step="0.0001" class="fx-input fx-num" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Narration</span>
                <input v-model="header.narration" class="fx-input" />
              </label>
              <button class="fx-btn" :disabled="busy" @click="saveHeader">Save header</button>
            </div>
          </template>
          <p v-else class="fx-muted">
            {{ document.status === "void" ? "This document is void." : "Finalized documents are not edited — raise a note against it." }}
          </p>
        </section>

        <!-- ── What has happened to it ───────────────────────────────────── -->
        <section v-else-if="tab === 'activity'" class="fx-section">
          <h3 class="fx-section__title">Notes raised against it</h3>
          <p v-if="!notes.length" class="fx-muted">None.</p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">Note</th>
                <th scope="col">Type</th>
                <th scope="col">Date</th>
                <th class="fx-num" scope="col">Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in notes" :key="'n-' + n.id" class="is-clickable" @click="openById(n.id)">
                <td class="identifier">{{ n.invoice_no }}</td>
                <td>{{ typeLabel(n.type) }}</td>
                <td><Figure :value="n.document_date" kind="date" /></td>
                <td class="fx-num"><Figure :value="n.grand_total" kind="currency" :currency-code="document.currency || 'INR'" /></td>
                <td><StatusChip :value="n.status" /></td>
                <td class="fx-muted">{{ n.reason || "—" }}</td>
              </tr>
            </tbody>
          </table>

          <h3 class="fx-section__title">Money received against it</h3>
          <p v-if="!receiptsOn.length" class="fx-muted">Nothing yet. Outstanding {{ money(document.outstanding) }}.</p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">Receipt</th>
                <th scope="col">Date</th>
                <th scope="col">How</th>
                <th scope="col">Reference</th>
                <th class="fx-num" scope="col">Placed</th>
                <th scope="col">Shortfall</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in receiptsOn" :key="'ra-' + i">
                <td class="identifier">{{ r.receipt_no }}</td>
                <td><Figure :value="r.receipt_date" kind="date" /></td>
                <td>{{ (r.mode || "").replace(/_/g, " ") }}</td>
                <td class="identifier">{{ r.reference || "—" }}</td>
                <td class="fx-num"><Figure :value="r.amount" kind="currency" currency-code="INR" /></td>
                <td>{{ r.resolution ? r.resolution.replace(/_/g, " ") : "—" }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- ── The journal it writes ─────────────────────────────────────── -->
        <section v-else-if="tab === 'journal'" class="fx-section">
          <p class="fx-muted">
            {{ document.is_posted ? "This is what was posted." : "This is what posting would write." }}
          </p>
          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Account</th>
                <th class="fx-num" scope="col">Debit</th>
                <th class="fx-num" scope="col">Credit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(l, i) in journal.lines" :key="'j-' + i">
                <td>{{ l.code }} — {{ l.name }}</td>
                <td class="fx-num"><Figure v-if="l.debit" :value="l.debit" kind="currency" currency-code="INR" /><span v-else>—</span></td>
                <td class="fx-num"><Figure v-if="l.credit" :value="l.credit" kind="currency" currency-code="INR" /><span v-else>—</span></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td class="fx-num"><strong>{{ journal.balanced ? "Balanced" : "NOT BALANCED" }}</strong></td>
                <td class="fx-num"><strong><Figure :value="journal.debits" kind="currency" currency-code="INR" /></strong></td>
                <td class="fx-num"><strong><Figure :value="journal.credits" kind="currency" currency-code="INR" /></strong></td>
              </tr>
            </tfoot>
          </table>
        </section>

        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>

        <!--
          🔒 The credit gate stopped this invoice. Overriding is its own ability (PRD §251) and always needs a
          reason — an override nobody explained is indistinguishable from somebody clicking through a warning.
        -->
        <section v-if="creditBlock" class="fx-section">
          <h3 class="fx-section__title">This is over their credit limit</h3>
          <p class="fx-muted">
            They owe {{ money(creditBlock.exposure) }} already; this invoice takes them to
            {{ money(creditBlock.projected) }} against a limit of {{ money(creditBlock.limit) }}.
          </p>
          <template v-if="canOverride">
            <label class="fx-field">
              <span class="fx-field__label">Why are you issuing it anyway?</span>
              <input v-model="overrideReason" class="fx-input" placeholder="the Boss agreed it on the phone" />
            </label>
            <button class="fx-btn fx-btn--primary" :disabled="busy || !overrideReason.trim()" @click="finalize(true)">
              Issue it over the limit
            </button>
            <p class="fx-muted">It is recorded on the invoice, with your name and this reason.</p>
          </template>
          <p v-else class="fx-muted">Raise the client's limit in Clients, or ask somebody who can override it.</p>
        </section>
      </template>

      <template #footer>
        <template v-if="document">
          <button class="fx-btn" :disabled="busy" @click="printOne">Print</button>
          <button v-if="canPost && can.note" class="fx-btn" @click="openRaise('credit_note', document)">Raise a note</button>
          <button v-if="canPost && can.void" class="fx-btn fx-btn--ghost" @click="voidFor = { reason: '' }">Void</button>
          <!--
            🔴 `finalize()`, with the brackets. Written as `@click="finalize"` Vue hands the method the DOM event
            as its first argument — which landed in `override`, made every ordinary Finalize look like a request
            to override the credit gate, and refused with "override reason is required".
          -->
          <button v-if="canPost && can.finalize" class="fx-btn fx-btn--primary" :disabled="busy || !items.length" @click="finalize()">
            Finalize
          </button>
          <button v-if="canPost && can.post" class="fx-btn fx-btn--primary" :disabled="busy" @click="postDocument">Post to ledger</button>
        </template>
      </template>
    </FxDrawer>

    <!-- Raise a document. -->
    <div v-if="raise" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="raise-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="raise-title" class="fx-modal__title">New {{ typeLabel(raise.type).toLowerCase() }}</h2>
        </header>
        <div class="fx-modal__body">
          <label class="fx-field">
            <span class="fx-field__label">Document</span>
            <select v-model="raise.type" class="fx-input" @change="raise.parent_invoice_id = null">
              <option value="invoice">Invoice — bill a client for a shipment</option>
              <option value="debit_note">Revenue Debit Note — charge more after the bill went out</option>
              <option value="credit_note">Revenue Credit Note — give some of it back</option>
              <option value="brokerage">Brokerage Invoice — commission from a carrier or agent</option>
              <option value="consol_invoice">Consol Invoice — settle a consolidation with an agent</option>
            </select>
          </label>

          <template v-if="isNote">
            <label class="fx-field">
              <span class="fx-field__label">Against which invoice</span>
              <select v-model="raise.parent_invoice_id" class="fx-input" @change="loadCreditRoom">
                <option :value="null">Choose…</option>
                <option v-for="p in billable" :key="p.id" :value="p.id">
                  {{ p.invoice_no }} — {{ p.organization }} — {{ p.currency }} {{ p.amount }}
                </option>
              </select>
            </label>
            <p v-if="creditRoom && raise.type === 'credit_note'" class="fx-muted">
              {{ creditRoom.invoice_no }} is for {{ money(creditRoom.grand_total) }};
              {{ money(creditRoom.already_credited) }} has been credited, so
              <strong>{{ money(creditRoom.room) }}</strong> is left.
            </p>
            <label class="fx-field">
              <span class="fx-field__label">Reason</span>
              <input v-model="raise.reason" class="fx-input" placeholder="weight corrected at acceptance" />
            </label>
          </template>

          <template v-else>
            <label class="fx-field">
              <span class="fx-field__label">Shipment</span>
              <select v-model="raise.job_id" class="fx-input">
                <option :value="null">Choose…</option>
                <option v-for="j in jobs" :key="j.id" :value="j.id">{{ j.execution_job_no }}</option>
              </select>
            </label>
            <label v-if="raise.type === 'invoice'" class="fx-field">
              <span class="fx-field__label">Client</span>
              <select v-model="raise.customer_id" class="fx-input">
                <option :value="null">Choose…</option>
                <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </label>
            <template v-else>
              <label class="fx-field">
                <span class="fx-field__label">Billed to</span>
                <select v-model="raise.partner_id" class="fx-input">
                  <option :value="null">Choose…</option>
                  <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }} ({{ p.partner_type }})</option>
                </select>
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Basis</span>
                <select v-model="raise.basis" class="fx-input">
                  <option value="flat_rate">Flat rate</option>
                  <option value="percentage_of_freight">Percentage of freight</option>
                  <option value="per_kg">Per kg</option>
                  <option value="per_container">Per container</option>
                </select>
              </label>
            </template>
          </template>

          <h3 class="fx-section__title">Lines</h3>
          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Description</th>
                <th scope="col">HSN/SAC</th>
                <th class="fx-num" scope="col">Qty</th>
                <th class="fx-num" scope="col">Rate</th>
                <th class="fx-num" scope="col">Tax %</th>
                <th class="fx-num" scope="col">Net</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(line, i) in raise.lines" :key="'l-' + i">
                <td><input v-model="line.description" class="fx-input" /></td>
                <td><input v-model="line.hsn_sac_code" class="fx-input" /></td>
                <td><input v-model.number="line.quantity" type="number" min="0" step="0.001" class="fx-input fx-num" /></td>
                <td><input v-model.number="line.rate" type="number" step="0.01" class="fx-input fx-num" /></td>
                <td><input v-model.number="line.tax_percentage" type="number" min="0" max="100" step="0.01" class="fx-input fx-num" /></td>
                <td class="fx-num">{{ money(lineNet(line)) }}</td>
                <td class="fx-row-actions">
                  <button class="fx-btn fx-btn--ghost" :disabled="raise.lines.length < 2" @click="raise.lines.splice(i, 1)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="fx-btn" @click="raise.lines.push(blankLine())">Add a line</button>

          <label class="fx-field">
            <span class="fx-field__label">Narration</span>
            <input v-model="raise.narration" class="fx-input" placeholder="what this document is for, in one line" />
          </label>

          <p class="fx-muted">Total {{ money(raiseTotal) }}. It is raised as a draft — finalize it to give it a number.</p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="raise = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !raiseValid" @click="saveRaise">
            {{ busy ? "Raising…" : "Raise it" }}
          </button>
        </footer>
      </div>
    </div>

    <!-- Record a receipt, and place it against what is open. -->
    <div v-if="receipt" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="receipt-title" class="fx-modal__title">Record a receipt</h2>
        </header>
        <div class="fx-modal__body">
          <div class="fx-toolbar">
            <label v-if="branches.length > 1" class="fx-field">
              <span class="fx-field__label">Branch</span>
              <select v-model="receipt.agent_id" class="fx-input">
                <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">From</span>
              <select v-model="receipt.payer_id" class="fx-input" @change="loadOpenDocuments">
                <option :value="null">Choose…</option>
                <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Date</span>
              <input v-model="receipt.receipt_date" type="date" class="fx-input" />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">How</span>
              <select v-model="receipt.mode" class="fx-input">
                <option v-for="m in modes" :key="m" :value="m">{{ m.replace(/_/g, " ") }}</option>
              </select>
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Their reference</span>
              <input v-model="receipt.reference" class="fx-input" placeholder="UTR, cheque no." />
            </label>
            <label class="fx-field">
              <span class="fx-field__label">Amount</span>
              <input v-model.number="receipt.amount" type="number" step="0.01" class="fx-input fx-num" />
            </label>
          </div>

          <h3 class="fx-section__title">What it settles</h3>
          <p v-if="!openDocuments.length" class="fx-muted">Choose who it came from; anything they still owe appears here.</p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">Document</th>
                <th scope="col">Date</th>
                <th scope="col">Due</th>
                <th class="fx-num" scope="col">Outstanding</th>
                <th class="fx-num" scope="col">Place against it</th>
                <th scope="col">If it is short</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in openDocuments" :key="'o-' + d.id">
                <td class="identifier">{{ d.invoice_no }}</td>
                <td><Figure :value="d.document_date" kind="date" /></td>
                <td><Figure v-if="d.due_date" :value="d.due_date" kind="date" /><span v-else class="fx-muted">—</span></td>
                <td class="fx-num"><Figure :value="d.outstanding" kind="currency" currency-code="INR" /></td>
                <td><input v-model.number="allocation[d.id]" type="number" step="0.01" min="0" class="fx-input fx-num" /></td>
                <td>
                  <select v-model="resolution[d.id]" class="fx-input">
                    <option value="">Still owed</option>
                    <option value="write_off">Write it off</option>
                    <option value="discount">Treat it as a discount</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="fx-muted">
            Placed {{ money(placedTotal) }} of {{ money(receipt.amount || 0) }}.
            <span v-if="placedTotal > (receipt.amount || 0)">That is more than arrived.</span>
            <span v-else-if="placedTotal < (receipt.amount || 0)">The rest sits on account.</span>
          </p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="receipt = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !receiptValid" @click="saveReceipt">
            {{ busy ? "Recording…" : "Record it" }}
          </button>
        </footer>
      </div>
    </div>

    <!-- Voiding says why, on the record, forever. -->
    <div v-if="voidFor" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="void-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="void-title" class="fx-modal__title">Void {{ document.invoice_no }}</h2>
        </header>
        <div class="fx-modal__body">
          <p class="fx-muted">
            It stays in the register and in the audit trail, marked void — the number is never reused and never
            disappears.
          </p>
          <label class="fx-field">
            <span class="fx-field__label">Why</span>
            <input v-model="voidFor.reason" class="fx-input" placeholder="raised on the wrong shipment" />
          </label>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="voidFor = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !voidFor.reason.trim()" @click="voidDocument">Void it</button>
        </footer>
      </div>
    </div>

    <!-- The IRN the portal returned, typed in until the GSP is connected. -->
    <div v-if="irnFor" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="irn-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="irn-title" class="fx-modal__title">Record the IRN for {{ irnFor.invoice_no }}</h2>
        </header>
        <div class="fx-modal__body">
          <label class="fx-field">
            <span class="fx-field__label">IRN</span>
            <input v-model="irnFor.irn" class="fx-input" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Acknowledgement no.</span>
            <input v-model="irnFor.ack_no" class="fx-input" />
          </label>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="irnFor = null">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !irnFor.irn.trim()" @click="saveIrn">Record it</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import FxDrawer from "@/view/pages/freight/components/FxDrawer.vue";

const STATUSES = ["draft", "finalized", "sent", "partially_paid", "paid", "void"];

/** Logi-Sys's Billing section: their Forwarding submenu, then Receipts and E-Invoice. */
const VIEWS = [
  { key: "all", label: "All documents" },
  { key: "invoice", label: "Invoices" },
  { key: "debit_note", label: "Debit notes" },
  { key: "credit_note", label: "Credit notes" },
  { key: "brokerage", label: "Brokerage" },
  { key: "consol_invoice", label: "Consol" },
  { key: "receipts", label: "Receipts" },
  { key: "einvoice", label: "E-Invoice" },
];

const DOC_TABS = [
  { key: "document", label: "Document" },
  { key: "activity", label: "Notes & receipts" },
  { key: "journal", label: "Journal" },
];

const REGISTERS = ["all", "invoice", "debit_note", "credit_note", "brokerage", "consol_invoice"];

export default {
  name: "Billing",
  components: { Figure, StatusChip, FxDrawer },
  props: {
    /** Rendered as a stage of Money in rather than as a page of its own. */
    embedded: { type: Boolean, default: false },
    /** Which register to open on, and any filter the stage implies. */
    initialView: { type: String, default: "all" },
    stageFilter: { type: Object, default: null },
  },
  data: () => ({
    view: "all", VIEWS, STATUSES, DOC_TABS,
    rows: [], totals: { count: 0, amount_inr: 0, outstanding_inr: 0, credited_inr: 0 },
    branches: [], types: {}, currencies: [], raisedBy: [],
    filters: { agent_id: null, from: "", to: "", q: "", status: "", currency: "",
               created_by: null, sort: "date", outstanding: false, exclude_credit_notes: false,
               /** Set by a Money in stage: handed over by pricing, or raised on this desk. */
               awaiting: false, own_drafts: false },
    /** Which rows are ticked for printing or mailing. */
    picked: {},
    receipts: [], modes: [], eInvoices: [], eInvoiceNote: "",
    /** The document open in the drawer, and everything that belongs to it. */
    document: null, items: [], notes: [], receiptsOn: [], journal: { lines: [] }, can: {}, tab: "document",
    /** Set when the credit gate refuses a finalize, so the drawer can offer the override (PRD §251). */
    creditBlock: null, canOverride: false, overrideReason: "",
    header: {}, newLine: {}, editingLine: null, lineDraft: {},
    /** The forms. */
    raise: null, creditRoom: null, jobs: [], partners: [], clients: [],
    receipt: null, openDocuments: [], allocation: {}, resolution: {},
    voidFor: null, irnFor: null,
    loading: true, busy: false, error: null, actionError: null, mailResult: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only accounts raise, finalize, post and send a bill. The Boss reads the register. */
    canPost() {
      return this.designation === "accounts";
    },
    isRegister() {
      return REGISTERS.includes(this.view);
    },
    /** The "New …" button raises what this view is showing; on All documents, an invoice. */
    newDocumentType() {
      return this.view === "all" ? "invoice" : this.view;
    },
    subtitleForView() {
      if (this.view === "receipts") return "Money received, and the documents each payment settled.";
      if (this.view === "einvoice") return "What has been through the invoice registration portal, and what is still waiting.";
      if (this.view === "all") return "Every sales document this company has raised, with what it was billed in and what it is worth in INR.";

      return {
        invoice: "What clients have been billed for their shipments.",
        debit_note: "Charges raised after the invoice went out — demurrage, a weight correction, an examination.",
        credit_note: "What has been given back — a rate dispute, an invoicing error, goodwill.",
        brokerage: "Commission billed to carriers and overseas agents.",
        consol_invoice: "Consolidations settled with the counterpart agent.",
      }[this.view];
    },
    chosen() {
      return this.rows.filter((r) => this.picked[r.id]).map((r) => r.id);
    },
    allChosen() {
      return this.rows.length > 0 && this.chosen.length === this.rows.length;
    },
    isNote() {
      return this.raise && ["debit_note", "credit_note"].includes(this.raise.type);
    },
    /** Only a numbered, unvoided invoice can carry a note. */
    billable() {
      return this.rows.filter((r) => r.type === "invoice" && !["draft", "void"].includes(r.status));
    },
    raiseTotal() {
      return this.raise ? this.raise.lines.reduce((sum, l) => sum + this.lineNet(l), 0) : 0;
    },
    raiseValid() {
      if (!this.raise) return false;
      const linesOk = this.raise.lines.every((l) => l.description && Number(l.rate) > 0);

      if (this.isNote) return linesOk && !!this.raise.parent_invoice_id && !!(this.raise.reason || "").trim();
      if (this.raise.type === "invoice") return linesOk && !!this.raise.job_id && !!this.raise.customer_id;

      return linesOk && !!this.raise.job_id && !!this.raise.partner_id;
    },
    placedTotal() {
      return Object.values(this.allocation).reduce((sum, v) => sum + (Number(v) || 0), 0);
    },
    receiptValid() {
      return !!(this.receipt && this.receipt.agent_id && Number(this.receipt.amount) > 0
        && this.placedTotal <= Number(this.receipt.amount) + 0.009);
    },
  },
  created() {
    this.view = this.initialView;
    if (this.stageFilter) Object.assign(this.filters, this.stageFilter);

    this.load();

    // Arrived from the journal's drill-through: open that document straight away.
    if (this.$route.query.open) this.openById(Number(this.$route.query.open));
  },
  watch: {
    // The pipeline changed stage: swap the register under it without remounting the drawer state.
    initialView(view) {
      this.view = view;
      this.document = null;
      Object.assign(this.filters, { awaiting: false, own_drafts: false }, this.stageFilter || {});
      this.load();
    },
  },
  methods: {
    showView(key) {
      this.view = key;
      this.document = null;
      this.actionError = null;
      this.mailResult = null;
      this.load();
    },
    typeLabel(type) {
      return (this.types[type] && this.types[type].label) || type;
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    /** 1.000 reads as 1, 18.00 as 18 — trailing zeros on a quantity are noise. */
    trim(value) {
      return String(Number(value || 0));
    },
    lineNet(line) {
      const amount = (Number(line.quantity) || 0) * (Number(line.rate) || 0);

      return Math.round(amount * (1 + (Number(line.tax_percentage) || 0) / 100) * 100) / 100;
    },
    blankLine() {
      return { description: "", hsn_sac_code: "", quantity: 1, rate: 0, tax_percentage: 18 };
    },
    query() {
      const params = [];
      if (this.view !== "all") params.push("types[]=" + this.view);
      ["agent_id", "from", "to", "q", "status", "currency", "created_by", "sort"].forEach((key) => {
        if (this.filters[key]) params.push(key + "=" + encodeURIComponent(this.filters[key]));
      });
      if (this.filters.outstanding) params.push("outstanding=1");
      if (this.filters.awaiting) params.push("awaiting=1");
      if (this.filters.own_drafts) params.push("own_drafts=1");
      if (this.view === "all" && this.filters.exclude_credit_notes) params.push("exclude_credit_notes=1");

      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;

      const path = { receipts: "/receipts", einvoice: "/billing/e-invoice" }[this.view] || "/billing";

      ApiService.get(path + (this.isRegister ? this.query() : ""))
        .then(({ data }) => {
          if (this.isRegister) {
            this.rows = data.rows || [];
            this.totals = data.totals;
            this.types = data.types || {};
            this.currencies = data.currencies || [];
            this.raisedBy = data.created_by || [];
            this.picked = {};
          } else if (this.view === "receipts") {
            this.receipts = data.rows || [];
            this.modes = data.modes || [];
          } else {
            this.eInvoices = data.rows || [];
            this.eInvoiceNote = data.note || "";
          }

          if (data.branches) this.branches = data.branches;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },

    /* ── One document ──────────────────────────────────────────────────── */
    open(row) {
      this.openById(row.id);
    },
    openById(id) {
      this.actionError = null;
      this.editingLine = null;
      this.tab = "document";
      ApiService.get(`/billing/${id}`)
        .then(({ data }) => this.showDocument(data))
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    showDocument(data) {
      this.document = data.document;
      this.creditBlock = null;
      this.overrideReason = "";
      this.items = data.items || [];
      this.notes = data.notes || [];
      this.receiptsOn = data.receipts || [];
      this.journal = data.journal || { lines: [] };
      this.can = data.can || {};
      this.editingLine = null;
      this.newLine = this.blankLine();
      this.header = {
        document_date: (this.document.document_date || "").slice(0, 10),
        due_date: (this.document.due_date || "").slice(0, 10),
        currency: this.document.currency,
        exchange_rate: Number(this.document.exchange_rate),
        narration: this.document.narration || "",
      };
    },
    saveHeader() {
      this.commit(() => ApiService.put(`/billing/${this.document.id}`, this.header));
    },
    addLine() {
      this.commit(() => ApiService.post(`/billing/${this.document.id}/lines`, this.newLine));
    },
    editLine(item) {
      this.editingLine = item.id;
      this.lineDraft = {
        description: item.description, hsn_sac_code: item.hsn_sac_code,
        quantity: Number(item.quantity), rate: Number(item.rate), tax_percentage: Number(item.tax_percentage),
      };
    },
    saveLine(lineId) {
      this.commit(() => ApiService.put(`/billing/${this.document.id}/lines/${lineId}`, this.lineDraft));
    },
    deleteLine(item) {
      this.commit(() => ApiService.delete(`/billing/${this.document.id}/lines/${item.id}`));
    },
    finalize(override = false) {
      // 🔒 `=== true`, never truthiness: overriding a credit hold has to be DELIBERATE, and a stray argument —
      // a DOM event, a promise, anything — must never be mistaken for the decision to ship on spent credit.
      const overriding = override === true && !!this.overrideReason.trim();

      this.creditBlock = null;
      this.commit(
        () => ApiService.post(`/invoices/${this.document.id}/finalize`,
          overriding ? { override_credit_hold: true, override_reason: this.overrideReason } : {}),
        true
      );
    },
    postDocument() {
      this.commit(() => ApiService.post(`/invoices/${this.document.id}/post`, {}), true);
    },
    voidDocument() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/billing/${this.document.id}/void`, this.voidFor)
        .then(({ data }) => { this.voidFor = null; this.showDocument(data); this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    printOne() {
      this.busy = true;
      ApiService.postForFile("/billing/print", { ids: [this.document.id] })
        .then(({ data }) => this.openFile(data, "application/pdf"))
        .catch(() => { this.actionError = "The document could not be printed."; })
        .finally(() => { this.busy = false; });
    },
    /**
     * Every drawer action ends the same way: do it, re-read the document, refresh the register behind.
     *
     * ⚠️ The document is re-read from the server rather than patched in place — finalizing changes the number, the
     * status and what the buttons may do, and a screen that guesses at those shows a stale document as a live one.
     */
    commit(call, refreshRegister = false) {
      this.busy = true;
      this.actionError = null;
      call()
        .then(({ data }) => {
          if (data && data.document) this.showDocument(data);
          else this.openById(this.document.id);
          if (refreshRegister) this.load();
        })
        .catch((e) => {
          const data = e.response && e.response.data;

          // The gate's own figures, so the offer states what it is overriding rather than repeating the error.
          if (data && data.reason === "credit_limit_exceeded") {
            this.creditBlock = data.credit;
            this.canOverride = !!data.can_override;
          }

          this.actionError = this.messageFor(e);
        })
        .finally(() => { this.busy = false; });
    },

    /* ── Printing, mailing, export ─────────────────────────────────────── */
    toggleAll() {
      const on = !this.allChosen;
      const picked = {};
      this.rows.forEach((r) => { picked[r.id] = on; });
      this.picked = picked;
    },
    printBills() {
      this.busy = true;
      this.actionError = null;
      ApiService.postForFile("/billing/print", { ids: this.chosen })
        .then(({ data }) => this.openFile(data, "application/pdf"))
        .catch(() => { this.actionError = "Those documents could not be printed."; })
        .finally(() => { this.busy = false; });
    },
    exportCsv() {
      this.busy = true;
      ApiService.query("/billing/export" + this.query(), { responseType: "blob" })
        .then(({ data }) => this.openFile(data, "text/csv", "billing.csv"))
        .catch(() => { this.actionError = "The export could not be built."; })
        .finally(() => { this.busy = false; });
    },
    openFile(data, mime, download) {
      const url = window.URL.createObjectURL(new Blob([data], { type: mime }));

      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = download;
        link.click();
      } else {
        window.open(url, "_blank");
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 30000);
    },
    mailBills() {
      this.busy = true;
      this.actionError = null;
      this.mailResult = null;
      ApiService.post("/billing/mail", { ids: this.chosen })
        .then(({ data }) => { this.mailResult = data; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },

    /* ── Raising ───────────────────────────────────────────────────────── */
    openRaise(type, against = null) {
      this.actionError = null;
      this.creditRoom = null;
      this.raise = { type, parent_invoice_id: against ? against.id : null,
                     job_id: null, customer_id: null, partner_id: null, basis: "flat_rate",
                     reason: "", narration: "", lines: [this.blankLine()] };

      if (against) this.loadCreditRoom();

      ApiService.get("/jobs?per_page=50").then(({ data }) => { this.jobs = data.data || data.rows || []; }).catch(() => {});
      ApiService.get("/partners").then(({ data }) => { this.partners = data.data || []; }).catch(() => {});
      ApiService.get("/customers").then(({ data }) => { this.clients = data.data || []; }).catch(() => {});
    },
    loadCreditRoom() {
      this.creditRoom = null;
      if (!this.raise.parent_invoice_id) return;

      ApiService.get(`/billing/${this.raise.parent_invoice_id}/credit-room`)
        .then(({ data }) => { this.creditRoom = data; })
        .catch(() => {});
    },
    saveRaise() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/billing/documents", this.raise)
        .then(({ data }) => {
          this.raise = null;
          this.load();
          // Straight into the drawer: a document raised and then hunted for in the register is a document
          // somebody forgets to finalize.
          this.openById(data.id);
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },

    /* ── Receipts ──────────────────────────────────────────────────────── */
    openReceipt() {
      this.actionError = null;
      this.openDocuments = [];
      this.allocation = {};
      this.resolution = {};
      this.receipt = {
        agent_id: this.branches.length ? this.branches[0].id : null, payer_id: null,
        receipt_date: new Date().toISOString().slice(0, 10), mode: "bank_transfer", reference: "", amount: 0,
      };

      ApiService.get("/customers").then(({ data }) => { this.clients = data.data || []; }).catch(() => {});
    },
    loadOpenDocuments() {
      this.openDocuments = [];
      this.allocation = {};
      if (!this.receipt.payer_id) return;

      ApiService.get(`/receipts/open-documents?customer_id=${this.receipt.payer_id}`)
        .then(({ data }) => { this.openDocuments = data.rows || []; })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    saveReceipt() {
      const allocations = this.openDocuments
        .filter((d) => Number(this.allocation[d.id]) > 0)
        .map((d) => ({ invoice_id: d.id, amount: Number(this.allocation[d.id]),
                       ...(this.resolution[d.id] ? { resolution: this.resolution[d.id] } : {}) }));

      this.busy = true;
      this.actionError = null;
      ApiService.post("/receipts", { ...this.receipt, allocations })
        .then(() => { this.receipt = null; this.showView("receipts"); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    postReceipt(row) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/receipts/${row.id}/post`, {})
        .then(() => this.load())
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    saveIrn() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/billing/${this.irnFor.id}/irn`, { irn: this.irnFor.irn, ack_no: this.irnFor.ack_no })
        .then(() => { this.irnFor = null; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    /*
     * The server's own words, whatever shape the refusal takes.
     *
     * 🔴 It used to read only `data.error`, so a Laravel VALIDATION failure — which answers with `message` and
     * `errors`, never `error` — fell through to "Something went wrong. Try again." on a screen that moves money.
     * A refusal nobody can read is a refusal nobody can act on, and it wasted an afternoon.
     */
    messageFor(e) {
      const response = e.response;
      const data = response && response.data;

      if (data && data.error) return data.error;

      // A 422 carries the field errors; show the first, which is the one the person has to fix.
      if (data && data.errors) {
        const first = Object.values(data.errors)[0];

        return Array.isArray(first) ? first[0] : String(first);
      }

      if (data && data.message) return data.message;

      // Nothing readable came back: say what actually happened rather than "something".
      return response
        ? `The server refused that (${response.status}).`
        : "Could not reach the server. Check your connection and try again.";
    },
  },
};
</script>
