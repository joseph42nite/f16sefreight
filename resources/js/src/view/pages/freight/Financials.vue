<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Financials</h1>
      <p class="fx-page-sub">
        {{ subtitleForView }}
        <router-link to="/billing">Billing →</router-link>
        <router-link to="/collections">Ageing &amp; collections →</router-link>
        <router-link to="/journal">Journal →</router-link>
        <router-link to="/settings/finance">Finance settings →</router-link>
      </p>
    </header>

    <!--
      Three registers, one page (user, 2026-09-18): what pricing has handed over and nobody has billed, the
      receivables themselves, and what we owe suppliers. Each is a different day's work, so each is its own view
      rather than a filter people have to remember to set.
    -->
    <div class="fx-toolbar fx-financials__views">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="fx-btn"
        :class="{ 'fx-btn--primary': view === v.key }"
        @click="showView(v.key)"
      >{{ v.label }}</button>
    </div>

    <div class="fx-toolbar">
      <!-- One accounts login runs the whole company; the branch picker is how it looks at one at a time. -->
      <label v-if="branches.length > 1" class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="branchId" class="fx-input" @change="load">
          <option :value="null">All branches</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
    </div>

    <div v-if="view === 'invoices' || view === 'awaiting'" class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Status</span>
        <select v-model="status" class="fx-input" @change="load">
          <option value="">All</option>
          <option v-for="s in STATUSES" :key="s" :value="s">{{ s.replace(/_/g, " ") }}</option>
        </select>
      </label>

      <label class="fx-checkbox">
        <input v-model="outstanding" type="checkbox" @change="load" />
        Outstanding only
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <!-- ── Supplier statements: what they say we owe, against our own vouchers ─ -->
    <template v-else-if="view === 'vendors'">
      <!--
        Not airlines alone (user, 2026-09-19): a CASS, a trucker's month, a broker's or a warehouse's all ask the same
        question. The supplier type only narrows the picker; the comparison is the same for every one of them.
      -->
      <div class="fx-toolbar">
        <label class="fx-field">
          <span class="fx-field__label">Supplier type</span>
          <select v-model="vendorForm.vendor_type" class="fx-input" @change="loadVendors">
            <option value="">All</option>
            <option v-for="t in vendorTypes" :key="t" :value="t">{{ t.replace(/[_-]/g, " ") }}</option>
          </select>
        </label>
        <button class="fx-btn" @click="importingVendor = !importingVendor">
          {{ importingVendor ? "Cancel import" : "Import a statement" }}
        </button>
      </div>

      <section v-if="importingVendor" class="fx-section">
        <div class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Supplier</span>
            <select v-model="vendorForm.vendor_id" class="fx-input">
              <option :value="null">Choose…</option>
              <option v-for="v in vendors" :key="v.id" :value="v.id">{{ v.name }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Period</span>
            <input v-model="vendorForm.period" class="fx-input" placeholder="2026-09 or Sep 2026 2nd half" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Their statement no.</span>
            <input v-model="vendorForm.statement_no" class="fx-input" />
          </label>
        </div>
        <label class="fx-field" for="vendor-csv">
          <span class="fx-field__label">Paste their statement (CSV: awb or job, description, date, weight, rate, amount)</span>
          <textarea id="vendor-csv" v-model="vendorForm.csv" class="fx-input" rows="6"></textarea>
        </label>
        <p class="fx-muted">Sending the same period again replaces it — a statement is their whole word for that month.</p>
        <button
          class="fx-btn fx-btn--primary"
          :disabled="busy || !vendorForm.vendor_id || !vendorForm.period.trim() || !vendorForm.csv.trim() || !branchForImport"
          @click="importVendorStatement"
        >{{ busy ? "Importing…" : "Import and compare" }}</button>
        <span v-if="!branchForImport" class="fx-muted"> Choose a branch above first.</span>
      </section>

      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      <p v-if="!vendorStatements.length" class="fx-muted">No supplier statement has been imported yet.</p>
      <table v-else class="fx-table">
        <thead>
          <tr>
            <th scope="col">Supplier</th>
            <th scope="col">Type</th>
            <th scope="col">Period</th>
            <th class="fx-num" scope="col">They say</th>
            <th scope="col">Lines</th>
            <th class="fx-num" scope="col">Difference</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="st in vendorStatements" :key="'vs-' + st.id" :class="{ 'is-selected': vendorStatement && vendorStatement.id === st.id }">
            <td>{{ st.vendor }}</td>
            <td class="fx-muted">{{ (st.vendor_type || "").replace(/[_-]/g, " ") }}</td>
            <td class="identifier">{{ st.period }}</td>
            <td class="fx-num"><Figure :value="st.their_total" kind="currency" :currency-code="st.currency || 'INR'" /></td>
            <td>
              {{ st.lines }} line(s)<span v-if="disagreeing(st)">, {{ disagreeing(st) }} to check</span>
            </td>
            <td class="fx-num"><Figure :value="st.difference" kind="currency" :currency-code="st.currency || 'INR'" /></td>
            <td class="fx-row-actions">
              <button class="fx-btn" :disabled="busy" @click="openStatement(st.id)">Open</button>
            </td>
          </tr>
        </tbody>
      </table>

      <section v-if="vendorStatement" class="fx-section">
        <h3 class="fx-section__title">
          {{ vendorStatement.vendor }} — {{ vendorStatement.period }}
        </h3>
        <div class="fx-toolbar">
          <button class="fx-btn" :disabled="busy" @click="recompare">Compare again</button>
          <button v-if="canPost" class="fx-btn" :disabled="busy" @click="draftVendorQuery">Ask the supplier</button>
        </div>
        <p class="fx-muted">
          They billed {{ money(vendorTotals.theirs) }}; we have {{ money(vendorTotals.ours) }} booked against these
          shipments for this supplier — a difference of {{ money(vendorTotals.difference) }}.
        </p>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Their reference</th>
              <th scope="col">Shipment</th>
              <th scope="col">What it is</th>
              <th class="fx-num" scope="col">They billed</th>
              <th class="fx-num" scope="col">We booked</th>
              <th class="fx-num" scope="col">Difference</th>
              <th scope="col">Where it stands</th>
              <th v-if="canPost" scope="col">Queried</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in vendorLines" :key="'vl-' + l.id">
              <td class="identifier">{{ l.reference || "—" }}</td>
              <td class="identifier">{{ l.job_no || "—" }}</td>
              <td>{{ l.description || "—" }}</td>
              <td class="fx-num"><Figure :value="l.their_amount" kind="currency" currency-code="INR" /></td>
              <td class="fx-num">
                <Figure v-if="l.our_amount !== null" :value="l.our_amount" kind="currency" currency-code="INR" />
                <span v-else class="fx-muted">—</span>
              </td>
              <td class="fx-num">
                <Figure v-if="l.difference !== null" :value="l.difference" kind="currency" currency-code="INR" />
                <span v-else class="fx-muted">—</span>
              </td>
              <td>{{ vendorStates[l.state] || l.state }}</td>
              <td v-if="canPost">
                <input
                  class="fx-input"
                  :value="l.dispute_note"
                  placeholder="what we asked them"
                  @change="dispute(l, $event.target.value)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>

    <p v-else-if="!rows.length" class="fx-muted">No documents match.</p>

    <!-- ── Bank reconciliation (PRD §6.5) ────────────────────────────────── -->
    <template v-else-if="view === 'bank'">
      <!--
        Statement in (user, 2026-09-19): a bank's CSV today, the Setu or Plaid feed on the same road later. Sending the
        same statement twice is normal and costs nothing — the bank's own reference is what stops money being counted
        twice.
      -->
      <div class="fx-toolbar">
        <button class="fx-btn" @click="importing = !importing">{{ importing ? "Cancel import" : "Import a statement" }}</button>
        <button class="fx-btn" :disabled="busy" @click="loadDifferences">Credited vs billed</button>
      </div>

      <section v-if="importing" class="fx-section">
        <label class="fx-field" for="bank-csv">
          <span class="fx-field__label">Paste the statement (CSV: date, reference, narration, credit, debit)</span>
          <textarea id="bank-csv" v-model="csv" class="fx-input" rows="6"></textarea>
        </label>
        <button class="fx-btn fx-btn--primary" :disabled="busy || !csv.trim() || !branchForImport" @click="importStatement">
          {{ busy ? "Importing…" : "Import" }}
        </button>
        <span v-if="!branchForImport" class="fx-muted"> Choose a branch above first.</span>
        <p v-if="importResult" class="fx-muted">
          {{ importResult.imported }} new, {{ importResult.repeated }} already had, {{ importResult.skipped }} skipped
          (a line with no reference cannot be told apart from the next one).
        </p>
      </section>

      <!-- What the bank credited against what we billed. -->
      <section v-if="differences.length" class="fx-section">
        <h3 class="fx-section__title">Credited vs billed</h3>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">What happened</th>
              <th scope="col">Invoice</th>
              <th class="fx-num" scope="col">Billed</th>
              <th class="fx-num" scope="col">Credited</th>
              <th class="fx-num" scope="col">Difference</th>
              <th scope="col">Bank says</th>
              <th v-if="canPost" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in differences" :key="'d-' + d.transaction_id + d.kind">
              <td>
                <span v-if="d.kind === 'short'">Paid short</span>
                <span v-else-if="d.kind === 'over'">Paid more than billed</span>
                <span v-else>Cannot be placed</span>
              </td>
              <td class="identifier">{{ d.invoice_no || "—" }}</td>
              <td class="fx-num"><Figure v-if="d.billed" :value="d.billed" kind="currency" currency-code="INR" /><span v-else>—</span></td>
              <td class="fx-num"><Figure :value="d.received" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="d.difference" kind="currency" currency-code="INR" /></td>
              <td class="fx-muted">{{ d.narration || d.reference || "—" }}</td>
              <td v-if="canPost" class="fx-row-actions">
                <button class="fx-btn" :disabled="busy" @click="draftQuery(d)">Ask the client</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Bank reference</th>
            <th class="fx-num" scope="col">Amount</th>
            <th scope="col">Status</th>
            <th scope="col">Settled against</th>
            <th v-if="canPost" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in rows" :key="'b-' + t.id" :class="{ 'is-selected': bankRow && bankRow.id === t.id }">
            <td class="identifier">{{ t.plaid_transaction_id || t.id }}</td>
            <td class="fx-num"><Figure :value="t.amount" kind="currency" currency-code="INR" /></td>
            <td><StatusChip :value="t.reconciliation_status" /></td>
            <td>
              <span v-if="t.matched_invoice">{{ t.matched_invoice.invoice_no }}</span>
              <span v-else class="fx-muted">—</span>
            </td>
            <td v-if="canPost" class="fx-row-actions">
              <button v-if="!t.matched_invoice" class="fx-btn" :disabled="busy" @click="findCandidates(t)">Find the invoice</button>
              <button v-else class="fx-btn fx-btn--ghost" :disabled="busy" @click="unmatch(t)">Unmatch</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="fx-muted">Nothing is waiting to be reconciled.</p>

      <section v-if="bankRow" class="fx-section">
        <h3 class="fx-section__title">
          What this {{ money(bankRow.amount) }} could settle
        </h3>
        <p class="fx-muted">{{ candidateNote }}</p>
        <p v-if="!candidates.length" class="fx-muted">No open invoice matches this amount.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">Invoice</th>
              <th scope="col">Client</th>
              <th class="fx-num" scope="col">Outstanding</th>
              <th scope="col">Confidence</th>
              <th scope="col">Why</th>
              <th v-if="canPost" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in candidates" :key="'c-' + c.invoice.id">
              <td class="identifier">{{ c.invoice.invoice_no }}</td>
              <td>{{ c.invoice.customer ? c.invoice.customer.name : "—" }}</td>
              <td class="fx-num"><Figure :value="c.invoice.outstanding" kind="currency" currency-code="INR" /></td>
              <td><StatusChip :value="c.confidence" /></td>
              <td>{{ c.reason }}</td>
              <td v-if="canPost" class="fx-row-actions">
                <!-- A short payment has to say what the difference IS: written off, discounted, or still owed. -->
                <select v-if="c.variance < 0" v-model="resolution" class="fx-input">
                  <option value="">Still owed (short paid)</option>
                  <option value="write_off">Write the difference off</option>
                  <option value="discount">Treat it as a discount</option>
                </select>
                <button class="fx-btn fx-btn--primary" :disabled="busy" @click="matchTo(c)">Settle</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </section>
    </template>

    <!-- ── Reports: P&L, balance sheet, trial balance (PRD §6.8) ─────────── -->
    <template v-else-if="view === 'reports'">
      <div class="fx-toolbar">
        <label class="fx-field">
          <span class="fx-field__label">Report</span>
          <select v-model="report" class="fx-input" @change="loadReport">
            <option v-for="r in REPORTS" :key="r.key" :value="r.key">{{ r.label }}</option>
          </select>
        </label>
        <label class="fx-field">
          <span class="fx-field__label">Period</span>
          <select v-model.number="periodId" class="fx-input" @change="loadReport">
            <option :value="null">Choose a period</option>
            <option v-for="p in visiblePeriods" :key="p.id" :value="p.id">
              {{ p.period_name }}{{ branches.length > 1 ? " · " + branchName(p.agent_id) : "" }} · {{ p.status }}
            </option>
          </select>
        </label>
      </div>

      <p v-if="!periodId" class="fx-muted">
        A report runs over a period, never a date range — half a period is a figure nobody can reconcile against
        anything they have filed.
      </p>
      <!-- 🔴 Every figure below opens. A number you cannot take apart is a number you have to take on faith. -->
      <p v-else class="fx-muted">Click any account to see the postings behind it, and the documents behind those.</p>
      <p v-else-if="reportLoading" class="fx-muted">Loading…</p>
      <template v-else-if="reportData">
        <!-- Profit & loss -->
        <table v-if="report === 'profit-and-loss'" class="fx-table">
          <tbody>
            <tr><td colspan="2"><strong>Revenue</strong></td></tr>
            <tr v-for="l in reportData.revenue.lines" :key="'r-' + l.code">
              <td><router-link :to="drillTo(l.code)">{{ l.code }} {{ l.name }}</router-link></td>
              <td class="fx-num"><Figure :value="l.amount" kind="currency" currency-code="INR" /></td>
            </tr>
            <tr><td><strong>Total revenue</strong></td><td class="fx-num"><Figure :value="reportData.revenue.total" kind="currency" currency-code="INR" /></td></tr>
            <tr><td colspan="2"><strong>Expense</strong></td></tr>
            <tr v-for="l in reportData.expense.lines" :key="'e-' + l.code">
              <td><router-link :to="drillTo(l.code)">{{ l.code }} {{ l.name }}</router-link></td>
              <td class="fx-num"><Figure :value="l.amount" kind="currency" currency-code="INR" /></td>
            </tr>
            <tr><td><strong>Total expense</strong></td><td class="fx-num"><Figure :value="reportData.expense.total" kind="currency" currency-code="INR" /></td></tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Net</strong></td>
              <td class="fx-num">
                <Figure :value="reportData.net" kind="currency" currency-code="INR" />
                <!-- NULL, never 0%: a period that billed nothing has no margin. -->
                <span v-if="reportData.margin_pct !== null" class="fx-muted"> · {{ reportData.margin_pct }}%</span>
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Balance sheet -->
        <table v-else-if="report === 'balance-sheet'" class="fx-table">
          <tbody>
            <tr><td colspan="2"><strong>Assets</strong></td></tr>
            <tr v-for="l in reportData.assets.lines" :key="'a-' + l.code">
              <td><router-link :to="drillTo(l.code)">{{ l.code }} {{ l.name }}</router-link></td>
              <td class="fx-num"><Figure :value="l.amount" kind="currency" currency-code="INR" /></td>
            </tr>
            <tr><td><strong>Total assets</strong></td><td class="fx-num"><Figure :value="reportData.assets.total" kind="currency" currency-code="INR" /></td></tr>
            <tr><td colspan="2"><strong>Liabilities</strong></td></tr>
            <tr v-for="l in reportData.liabilities.lines" :key="'l-' + l.code">
              <td><router-link :to="drillTo(l.code)">{{ l.code }} {{ l.name }}</router-link></td>
              <td class="fx-num"><Figure :value="l.amount" kind="currency" currency-code="INR" /></td>
            </tr>
            <tr><td><strong>Total liabilities</strong></td><td class="fx-num"><Figure :value="reportData.liabilities.total" kind="currency" currency-code="INR" /></td></tr>
          </tbody>
          <tfoot>
            <tr><td><strong>Retained earnings (the residual)</strong></td><td class="fx-num"><Figure :value="reportData.equity" kind="currency" currency-code="INR" /></td></tr>
          </tfoot>
        </table>

        <!-- Trial balance -->
        <table v-else class="fx-table">
          <thead><tr><th scope="col">Account</th><th class="fx-num" scope="col">Debit</th><th class="fx-num" scope="col">Credit</th></tr></thead>
          <tbody>
            <tr v-for="a in reportData.accounts" :key="'t-' + a.code">
              <td><router-link :to="drillTo(a.code)">{{ a.code }} {{ a.name }}</router-link></td>
              <td class="fx-num"><Figure :value="a.debit" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="a.credit" kind="currency" currency-code="INR" /></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td :class="reportData.balanced ? 'fx-journal__balanced' : 'fx-journal__unbalanced'">
                {{ reportData.balanced ? "balanced ✓" : "OUT OF BALANCE by " + reportData.difference }}
              </td>
              <td class="fx-num"><Figure :value="reportData.totals.debit" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="reportData.totals.credit" kind="currency" currency-code="INR" /></td>
            </tr>
          </tfoot>
        </table>
      </template>
    </template>

    <!-- ── Accounting periods — accounts alone opens and closes them ─────── -->
    <template v-else-if="view === 'periods'">
      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Branch</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Status</th>
            <th v-if="canPost" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in visiblePeriods" :key="'p-' + p.id">
            <td>{{ p.period_name }}</td>
            <td>{{ branchName(p.agent_id) }}</td>
            <td><Figure :value="p.start_date" kind="date" /></td>
            <td><Figure :value="p.end_date" kind="date" /></td>
            <td><StatusChip :value="p.status" /></td>
            <td v-if="canPost" class="fx-row-actions">
              <button v-if="p.status === 'open'" class="fx-btn" :disabled="busy" @click="closePeriod(p)">Close</button>
              <span v-else class="fx-muted">closed</span>
            </td>
          </tr>
        </tbody>
      </table>

      <section v-if="canPost" class="fx-section">
        <h3 class="fx-section__title">Open a period</h3>
        <div class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Branch</span>
            <select v-model.number="newPeriod.agent_id" class="fx-input">
              <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Name</span>
            <input v-model="newPeriod.period_name" class="fx-input" placeholder="September 2026" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">From</span>
            <input v-model="newPeriod.start_date" class="fx-input" type="date" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">To</span>
            <input v-model="newPeriod.end_date" class="fx-input" type="date" />
          </label>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !newPeriodValid" @click="openPeriod">Open</button>
        </div>
        <p class="fx-muted">
          Nothing can be posted into a month without an open period, and closing one stops anything else being posted
          into it. Only accounts opens or closes a period.
        </p>
      </section>
      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
    </template>

    <!-- ── GST charged, per document (PRD §6.2.7) ────────────────────────── -->
    <template v-else-if="view === 'gst'">
      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">Client</th>
            <th scope="col">Branch</th>
            <th scope="col">Date</th>
            <th class="fx-num" scope="col">CGST</th>
            <th class="fx-num" scope="col">SGST</th>
            <th class="fx-num" scope="col">IGST</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="'g-' + r.id">
            <td class="identifier">{{ r.invoice_no || r.voucher_type }}</td>
            <td>{{ r.customer || "—" }}</td>
            <td>{{ r.branch }}</td>
            <td><Figure :value="r.document_date || r.created_at" kind="date" /></td>
            <td class="fx-num"><Figure :value="r.cgst_amount" kind="currency" currency-code="INR" /></td>
            <td class="fx-num"><Figure :value="r.sgst_amount" kind="currency" currency-code="INR" /></td>
            <td class="fx-num"><Figure :value="r.igst_amount" kind="currency" currency-code="INR" /></td>
          </tr>
        </tbody>
        <tfoot v-if="totals">
          <tr>
            <td colspan="4"><strong>Total</strong></td>
            <td class="fx-num"><Figure :value="totals.cgst" kind="currency" currency-code="INR" /></td>
            <td class="fx-num"><Figure :value="totals.sgst" kind="currency" currency-code="INR" /></td>
            <td class="fx-num"><Figure :value="totals.igst" kind="currency" currency-code="INR" /></td>
          </tr>
        </tfoot>
      </table>
      <p class="fx-muted">
        Written when a document is finalized: CGST and SGST within the state, IGST across it. Nothing here is edited —
        it is what was charged.
      </p>
    </template>

    <!-- ── Drafted, not yet in the ledger (PRD §6.2.8) ───────────────────── -->
    <template v-else-if="view === 'unposted'">
      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">Kind</th>
            <th scope="col">Branch</th>
            <th scope="col">Raised</th>
            <th scope="col">By</th>
            <th scope="col">Waiting for</th>
            <th class="fx-num" scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="'u-' + r.id">
            <td class="identifier">
              <span v-if="r.number">{{ r.number }}</span>
              <span v-else class="is-empty" aria-label="Not yet numbered"></span>
            </td>
            <td>{{ r.source_type === "invoice" ? "Invoice" : "Purchase voucher" }}</td>
            <td>{{ r.branch }}</td>
            <td><Figure :value="r.created_at" kind="date" /></td>
            <td>{{ r.created_by || "—" }}</td>
            <td>{{ r.waiting_for }}</td>
            <td class="fx-num"><Figure :value="r.net_amount" kind="currency" currency-code="INR" /></td>
          </tr>
        </tbody>
        <tfoot v-if="totals !== null">
          <tr><td colspan="6"><strong>Total waiting</strong></td><td class="fx-num"><Figure :value="totals" kind="currency" currency-code="INR" /></td></tr>
        </tfoot>
      </table>
      <p class="fx-muted">Each stays here until it is posted; posting removes it from this list.</p>
    </template>

    <!-- ── What we owe suppliers ─────────────────────────────────────────── -->
    <table v-else-if="view === 'vouchers'" class="fx-table">
      <thead>
        <tr>
          <th scope="col">Voucher</th>
          <th scope="col">Supplier</th>
          <th scope="col">Shipment</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          <th scope="col">Posted</th>
          <th class="fx-num" scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="'v-' + row.id"
          class="is-clickable"
          :class="{ 'is-selected': selected && selected.id === row.id }"
          tabindex="0"
          @click="selectVoucher(row)"
          @keydown.enter="selectVoucher(row)"
        >
          <td class="identifier">{{ row.voucher_no }}</td>
          <td>{{ row.vendor ? row.vendor.name : "—" }}</td>
          <td class="identifier">{{ row.job_no || row.job_id }}</td>
          <td><Figure :value="row.document_date" kind="date" /></td>
          <td><StatusChip :value="row.status" /></td>
          <td><StatusChip :value="row.is_posted ? 'posted' : 'unposted'" /></td>
          <td class="fx-num"><Figure :value="row.net_amount" kind="currency" currency-code="INR" /></td>
        </tr>
      </tbody>
    </table>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th v-if="view === 'awaiting'" scope="col">Shipment</th>
          <th scope="col">Invoice</th>
          <th scope="col">Customer</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          <th scope="col">Posted</th>
          <th class="fx-num" scope="col">Total</th>
          <template v-if="view === 'awaiting'">
            <th class="fx-num" scope="col">Cost</th>
            <th class="fx-num" scope="col">Margin</th>
            <th scope="col">Sent by</th>
          </template>
          <template v-else>
            <th class="fx-num" scope="col">Paid</th>
            <th class="fx-num" scope="col">Balance</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.id"
          class="is-clickable"
          :class="{ 'is-selected': selected && selected.id === row.id }"
          tabindex="0"
          @click="select(row)"
          @keydown.enter="select(row)"
        >
          <!-- §4.1 a draft has no number yet — an em dash, never a blank or a zero. -->
          <td v-if="view === 'awaiting'" class="identifier">{{ row.job_no }}</td>
          <td class="identifier">
            <span v-if="row.invoice_no">{{ row.invoice_no }}</span>
            <span v-else class="is-empty" aria-label="Not yet numbered"></span>
          </td>
          <td>
            <span v-if="row.customer">{{ row.customer.name }}</span>
            <!-- customer is NULL on partner-billed documents — a real state, not a gap. -->
            <span v-else class="fx-muted">Partner-billed</span>
          </td>
          <td><Figure :value="row.document_date" kind="date" /></td>
          <td><StatusChip :value="row.status" /></td>
          <td>
            <StatusChip :value="row.is_posted ? 'posted' : 'unposted'" />
          </td>
          <td class="fx-num">
            <Figure :value="view === 'awaiting' ? row.sell_total : row.grand_total" kind="currency" :currency-code="row.currency || 'INR'" />
          </td>
          <template v-if="view === 'awaiting'">
            <td class="fx-num"><Figure :value="row.buy_total" kind="currency" currency-code="INR" /></td>
            <td class="fx-num">
              <!-- An unbilled job has no margin yet; PRD §7.2 — NULL, never −100%. -->
              <Figure v-if="row.margin !== null" :value="row.margin" kind="currency" currency-code="INR" />
              <span v-else class="fx-muted">—</span>
            </td>
            <td>{{ row.sent_to_accounts_by || "—" }}</td>
          </template>
          <template v-else>
            <td class="fx-num"><Figure :value="row.amount_paid" kind="currency" :currency-code="row.currency || 'INR'" /></td>
            <td class="fx-num"><Figure :value="balanceOf(row)" kind="currency" :currency-code="row.currency || 'INR'" /></td>
          </template>
        </tr>
      </tbody>
    </table>

    <FxDrawer
      :open="!!selected"
      :title="selected ? (selected.invoice_no || 'Draft invoice') : ''"
      :subtitle="drawerSubtitle"
      :tabs="view === 'vouchers' ? VOUCHER_TABS : TABS"
      :active-tab="tab"
      @tab="tab = $event"
      @close="deselect"
    >
      <template v-if="selected">
        <!-- ── Credit standing ─────────────────────────────────────────── -->
        <section v-if="tab === 'credit'" class="fx-section">
          <p v-if="!selected.customer_id" class="fx-muted">
            This document is billed to a partner, so there is no customer credit to check —
            credit, collections and AR are customer-only concepts.
          </p>
          <p v-else-if="creditLoading" class="fx-muted">Loading…</p>
          <template v-else-if="credit">
            <h3 class="fx-section__title">{{ credit.customer.name }} — this billing entity</h3>
            <dl class="fx-defs">
              <dt>Credit limit</dt>
              <dd>
                <!--
                  🔴 NULL IS NOT ZERO, and here the difference decides whether cargo
                  moves. "No limit configured" must never render as a limit of 0.00 —
                  the desk would read a working gate as a broken one.
                -->
                <span v-if="credit.branch.limit === null" class="fx-muted">Not configured</span>
                <Figure v-else :value="credit.branch.limit" kind="currency" currency-code="INR" />
              </dd>

              <dt>Current exposure</dt>
              <dd><Figure :value="credit.branch.exposure" kind="currency" currency-code="INR" /></dd>

              <dt>Standing</dt>
              <dd>
                <StatusChip :value="credit.branch.blocked ? 'credit_hold' : 'within_limit'" />
              </dd>
            </dl>

            <!--
              ⚠️ DISPLAYED, NEVER ENFORCED ON. Separate GSTINs are separate billing
              entities; one branch at its limit must not freeze another branch's cargo.
              The label has to say so, or the next person to read this screen will
              assume the gate uses this number.
            -->
            <template v-if="credit.group && credit.group.members > 1">
              <h3 class="fx-section__title" style="margin-top: var(--space-5)">
                Group roll-up — {{ credit.group.members }} billing entities
              </h3>
              <dl class="fx-defs">
                <dt>Combined exposure</dt>
                <dd><Figure :value="credit.group.exposure" kind="currency" currency-code="INR" /></dd>
              </dl>
              <p class="fx-muted" style="margin-top: var(--space-2)">
                Shown for context only. The gate is applied per billing entity, so this
                total never blocks anything on its own.
              </p>
            </template>
          </template>
        </section>

        <!-- ── The journal ─────────────────────────────────────────────── -->
        <section v-else class="fx-section">
          <p v-if="previewLoading" class="fx-muted">Loading…</p>
          <template v-else-if="preview">
            <h3 class="fx-section__title">The journal this posting writes</h3>

            <!--
              §9.6 the lines are shown BEFORE commit — and they come from the server's
              own posting code, not from arithmetic repeated here. A preview computed
              in the browser can drift from what posts and still look correct.
            -->
            <table class="fx-journal">
              <tbody>
                <tr v-for="(l, i) in preview.lines" :key="i">
                  <td class="fx-journal__dc">{{ l.debit > 0 ? "Dr" : "Cr" }}</td>
                  <td>{{ l.code }}</td>
                  <td class="fx-journal__amt">
                    <Figure :value="l.debit > 0 ? l.debit : l.credit" kind="currency" currency-code="INR" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" :class="preview.balanced ? 'fx-journal__balanced' : 'fx-journal__unbalanced'">
                    {{ preview.balanced ? "balanced ✓" : "OUT OF BALANCE" }}
                  </td>
                  <td class="fx-journal__amt">
                    <Figure :value="preview.debits" kind="currency" currency-code="INR" />
                  </td>
                </tr>
              </tfoot>
            </table>

            <p v-if="alreadyPosted" class="fx-muted" style="margin-top: var(--space-3)">
              Already posted. This is the journal that was written.
            </p>
            <p v-else class="fx-warn" style="margin-top: var(--space-3)">
              Posting cannot be undone. A correction requires a credit note.
            </p>
          </template>
        </section>

        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </template>

      <template #footer>
        <button class="fx-btn" @click="deselect">Close</button>

        <!--
          §8.1 role forbids -> HIDDEN, never disabled. An operations or boss login has
          no path to these at all; a greyed button only invites "why can't I?" tickets.
          The server refuses them regardless — this is presentation, not the gate.
        -->
        <template v-if="canPost && selected">
          <button
            v-if="view !== 'vouchers' && selected.status === 'draft'"
            class="fx-btn fx-btn--primary"
            :disabled="busy"
            @click="finalize"
          >Finalize</button>

          <button
            v-else-if="!selected.is_posted"
            class="fx-btn fx-btn--primary"
            :disabled="busy || (preview && !preview.balanced)"
            @click="post"
          >Post to Ledger</button>
        </template>
      </template>
    </FxDrawer>
    <!-- The drafted mail, before anybody sends it. -->
    <div v-if="queryDraft" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="query-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="query-title" class="fx-modal__title">{{ queryDraft.title }}</h2>
        </header>
        <div class="fx-modal__body fx-newmail">
          <p class="fx-muted">
            Written from the figures{{ queryDraft.written_by === "ai" ? " by the model" : "" }}; every number comes
            from our own records. Edit anything before it goes.
          </p>
          <label class="fx-field" for="query-to">
            <span class="fx-field__label">To</span>
            <input id="query-to" v-model="queryDraft.toLine" class="fx-input" placeholder="comma separated" />
          </label>
          <label class="fx-field" for="query-subject">
            <span class="fx-field__label">Subject</span>
            <input id="query-subject" v-model="queryDraft.subject" class="fx-input" />
          </label>
          <MailEditor v-model="queryDraft.body" />
          <p v-if="queryDraft.sent" class="fx-notice" role="status">Sent from your mailbox.</p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="queryDraft = null">Close</button>
          <button v-if="!queryDraft.sent" class="fx-btn fx-btn--primary" :disabled="busy || !queryDraft.toLine.trim()" @click="sendQuery">
            {{ busy ? "Sending…" : "Send from my mailbox" }}
          </button>
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
import MailEditor from "@/view/pages/freight/components/MailEditor.vue";

const STATUSES = ["draft", "finalized", "sent", "partially_paid", "paid", "void"];

/** The three registers accounts work (user, 2026-09-18). */
const VIEWS = [
  { key: "awaiting", label: "Waiting to be billed" },
  { key: "invoices", label: "Invoices" },
  { key: "vouchers", label: "What we owe" },
  { key: "gst", label: "GST register" },
  { key: "unposted", label: "Not yet posted" },
  { key: "reports", label: "Reports" },
  { key: "periods", label: "Periods" },
  { key: "bank", label: "Bank" },
  { key: "vendors", label: "Supplier statements" },
];

/** The three reports the ledger can prove (PRD §6.8). Each runs over a PERIOD, never a free date range. */
const REPORTS = [
  { key: "profit-and-loss", label: "Profit & loss" },
  { key: "balance-sheet", label: "Balance sheet" },
  { key: "trial-balance", label: "Trial balance" },
];
const TABS = [
  { key: "credit", label: "Credit standing" },
  { key: "journal", label: "Journal" },
];

export default {
  name: "Financials",
  components: { Figure, StatusChip, FxDrawer, MailEditor },
  data: () => ({
    rows: [], loading: true, error: null,
    status: "", outstanding: false,
    /** Which register is open: the hand-over queue, the receivables, the payables, or a read-only register. */
    view: "awaiting", VIEWS,
    /** One accounts login covers the company; NULL is every branch (user, 2026-09-18). */
    branches: [], branchId: null,
    /** The totals row of whichever register is open. */
    totals: null,
    /** Reports: which one, over which period, and what came back. */
    REPORTS, report: "profit-and-loss", periodId: null, periods: [], reportData: null, reportLoading: false,
    /** A period being opened. */
    newPeriod: { agent_id: null, period_name: "", start_date: "", end_date: "" },
    /** Bank reconciliation: the row being settled, what it could settle, and how a short payment is treated. */
    bankRow: null, candidates: [], candidateNote: "", resolution: "",
    /** Statement import, the credited-vs-billed list, and the query mail being written. */
    importing: false, csv: "", importResult: null, differences: [], queryDraft: null,
    /** Supplier statements: the list, the one open, and the import being typed (user, 2026-09-19). */
    vendorStatements: [], vendorTypes: [], vendorStates: {}, vendors: [],
    vendorStatement: null, vendorLines: [], vendorTotals: { theirs: 0, ours: 0, difference: 0 },
    importingVendor: false, vendorForm: { vendor_type: "", vendor_id: null, period: "", statement_no: "", csv: "" },
    selected: null, tab: "credit",
    credit: null, creditLoading: false,
    preview: null, previewLoading: false,
    busy: false, actionError: null,
    STATUSES, TABS,
    /** A voucher has no customer credit to check, so its drawer shows the journal alone. */
    VOUCHER_TABS: [{ key: "journal", label: "Journal" }],
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only accounts commits. The Boss reads the register and the journal, and that
       asymmetry is the segregation of duties, not a UI convenience. */
    canPost() {
      return this.designation === "accounts";
    },
    alreadyPosted() {
      return !!(this.selected && this.selected.is_posted);
    },
    drawerSubtitle() {
      if (!this.selected) return null;
      if (this.view === "vouchers") return this.selected.vendor ? this.selected.vendor.name : "No supplier";

      return this.selected.customer ? this.selected.customer.name : "Partner-billed";
    },
    /** The periods of the branch in view, newest first. */
    visiblePeriods() {
      return this.branchId ? this.periods.filter((p) => p.agent_id === this.branchId) : this.periods;
    },
    /** The branch a statement belongs to: the one in view, or the only one there is. */
    branchForImport() {
      return this.branchId || (this.branches.length === 1 ? this.branches[0].id : null);
    },
    newPeriodValid() {
      const p = this.newPeriod;
      return p.agent_id && p.period_name.trim() && p.start_date && p.end_date && p.start_date <= p.end_date;
    },
    /** The queue is the hand-over; the receivables and payables are the registers themselves. */
    subtitleForView() {
      return {
        awaiting: "Cost sheets pricing has sent across, with what each shipment sells for and what it cost. Finalize one to bill it.",
        gst: "The tax charged on every finalized document, for GSTR-1. Read-only — it is what was charged.",
        reports: "What the ledger proves, over one period of one branch.",
        periods: "The months the ledger is open for. Nothing posts into a month without an open period.",
        bank: "Money in the bank, and the invoice each payment settles.",
        vendors: "What each supplier says we owe — an airline's CASS, a trucker's month, anyone's — against our own vouchers.",
        unposted: "Documents raised and not yet in the ledger, and what each is waiting for.",
        invoices: "The receivables register for this branch. Select a row to see the client's credit standing and the journal a posting would write.",
        vouchers: "What this branch owes its suppliers, one voucher per supplier per shipment. Select one to see the journal a posting would write.",
      }[this.view];
    },
  },
  created() {
    this.load();
  },
  methods: {
    /* Balance is derived, never stored — a stored balance drifts from its own parts. */
    balanceOf(row) {
      return Number(row.grand_total || 0) - Number(row.amount_paid || 0);
    },
    /** From a report line down to the ledger: the same account, the same period. */
    drillTo(code) {
      return { path: "/journal", query: { account: code, period_id: this.periodId } };
    },
    showView(key) {
      this.view = key;
      this.deselect();
      this.reportData = null;

      if (key === "reports" || key === "periods") {
        this.loadPeriods();
        return;
      }

      if (key === "vendors") {
        this.vendorStatement = null;
        this.loadVendorStatements();
        return;
      }

      this.load();
    },
    loadPeriods() {
      this.loading = true;
      ApiService.get("/reports/periods")
        .then(({ data }) => {
          this.periods = data.periods || [];
          this.branches = data.branches || this.branches;
          if (!this.newPeriod.agent_id && this.branches.length) this.newPeriod.agent_id = this.branches[0].id;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    loadReport() {
      if (!this.periodId) return;

      this.reportLoading = true;
      this.reportData = null;
      ApiService.get(`/reports/${this.report}?period_id=${this.periodId}`)
        .then(({ data }) => { this.reportData = data; this.error = null; })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.reportLoading = false; });
    },
    openPeriod() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/reports/periods", this.newPeriod)
        .then(() => {
          this.newPeriod = { ...this.newPeriod, period_name: "", start_date: "", end_date: "" };
          this.loadPeriods();
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    closePeriod(period) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/reports/periods/${period.id}/close`, {})
        .then(() => this.loadPeriods())
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    findCandidates(row) {
      this.bankRow = row;
      this.candidates = [];
      this.actionError = null;
      this.resolution = "";

      ApiService.get(`/reconciliation/${row.id}/candidates`)
        .then(({ data }) => { this.candidates = data.candidates || []; this.candidateNote = data.limitation || ""; })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    matchTo(candidate) {
      this.busy = true;
      this.actionError = null;

      ApiService.post(`/reconciliation/${this.bankRow.id}/match`, {
        invoice_id: candidate.invoice.id,
        ...(this.resolution ? { resolution: this.resolution } : {}),
      })
        .then(() => { this.bankRow = null; this.candidates = []; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    unmatch(row) {
      this.busy = true;
      this.actionError = null;

      ApiService.post(`/reconciliation/${row.id}/unmatch`, {})
        .then(() => this.load())
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    importStatement() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/reconciliation/import", { agent_id: this.branchForImport, csv: this.csv })
        .then(({ data }) => { this.importResult = data; this.csv = ""; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    /** How many lines on a statement do not agree — the only number anybody acts on. */
    disagreeing(statement) {
      const by = statement.by_state || {};
      return (by.different || 0) + (by.not_booked || 0) + (by.unmatched || 0);
    },
    loadVendorStatements() {
      this.loading = true;
      const params = [];
      if (this.branchId) params.push("agent_id=" + this.branchId);
      if (this.vendorForm.vendor_type) params.push("vendor_type=" + encodeURIComponent(this.vendorForm.vendor_type));

      ApiService.get("/vendor-statements" + (params.length ? "?" + params.join("&") : ""))
        .then(({ data }) => {
          this.vendorStatements = data.statements || [];
          this.vendorTypes = data.vendor_types || [];
          this.vendorStates = data.states || {};
          if (data.branches) this.branches = data.branches;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    /** The suppliers of the chosen type, for the picker. */
    loadVendors() {
      this.vendorForm.vendor_id = null;
      this.loadVendorStatements();
      ApiService.get("/partners" + (this.vendorForm.vendor_type ? "?type=" + encodeURIComponent(this.vendorForm.vendor_type) : ""))
        .then(({ data }) => { this.vendors = data.data || []; })
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    importVendorStatement() {
      this.busy = true;
      this.actionError = null;
      ApiService.post("/vendor-statements", { agent_id: this.branchForImport, ...this.vendorForm })
        .then(({ data }) => {
          this.showStatement(data);
          this.vendorForm = { ...this.vendorForm, csv: "", statement_no: "" };
          this.importingVendor = false;
          this.loadVendorStatements();
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    openStatement(id) {
      this.busy = true;
      this.actionError = null;
      ApiService.get(`/vendor-statements/${id}`)
        .then(({ data }) => this.showStatement(data))
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    /** Compare again — vouchers move, and a line with no cost booked last week may have one today. */
    recompare() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/vendor-statements/${this.vendorStatement.id}/compare`, {})
        .then(({ data }) => { this.showStatement(data); this.loadVendorStatements(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    dispute(line, note) {
      ApiService.post(`/vendor-statements/${this.vendorStatement.id}/lines/${line.id}/dispute`, { dispute_note: note })
        .then(({ data }) => this.showStatement(data))
        .catch((e) => { this.actionError = this.messageFor(e); });
    },
    draftVendorQuery() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/vendor-statements/${this.vendorStatement.id}/draft-query`, {})
        .then(({ data }) => {
          this.queryDraft = { ...data, title: "Ask the supplier about these lines", toLine: (data.to || []).join(", "), sent: false };
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    showStatement(data) {
      this.vendorStatement = data.statement;
      this.vendorLines = data.lines || [];
      this.vendorTotals = data.totals || { theirs: 0, ours: 0, difference: 0 };
      this.vendorStates = data.states || this.vendorStates;
    },
    loadDifferences() {
      this.busy = true;
      ApiService.get("/reconciliation/differences" + (this.branchId ? "?agent_id=" + this.branchId : ""))
        .then(({ data }) => { this.differences = data.differences || []; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    draftQuery(difference) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/reconciliation/${difference.transaction_id}/draft-query`, { kind: difference.kind })
        .then(({ data }) => {
          this.queryDraft = { ...data, title: "Ask the client about this payment", toLine: (data.to || []).join(", "), sent: false };
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    /** Sent from the person's own mailbox, through the same path as any other mail they write. */
    sendQuery() {
      const form = new FormData();
      this.queryDraft.toLine.split(",").map((a) => a.trim()).filter(Boolean).forEach((a) => form.append("to[]", a));
      form.append("subject", this.queryDraft.subject);
      form.append("body", this.queryDraft.body);
      form.append("include_signature", "1");

      this.busy = true;
      this.actionError = null;
      ApiService.post("/inbox/compose", form)
        .then(() => { this.queryDraft = { ...this.queryDraft, sent: true }; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    branchName(id) {
      const b = this.branches.find((x) => x.id === id);
      return b ? b.name : "—";
    },
    load() {
      if (this.view === "vendors") {
        this.loadVendorStatements();
        return;
      }

      this.loading = true;
      const params = [];

      if (this.view === "awaiting") params.push("awaiting=1");
      if (this.view !== "vouchers" && this.status) params.push("status=" + encodeURIComponent(this.status));
      if (this.view === "invoices" && this.outstanding) params.push("outstanding=1");

      if (this.branchId) params.push("agent_id=" + this.branchId);

      const path = {
        vouchers: "/vouchers", gst: "/registers/gst", unposted: "/registers/unposted", bank: "/reconciliation",
      }[this.view] || "/invoices";

      ApiService.get(path + (params.length ? "?" + params.join("&") : ""))
        .then(({ data }) => {
          // The registers answer with their own shape: rows plus the totals that belong under them.
          this.rows = data.data || data.rows || [];
          this.totals = data.totals !== undefined ? data.totals : (data.total !== undefined ? data.total : null);
          if (data.branches) this.branches = data.branches;
          this.error = null;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    /** A voucher's drawer: the journal a posting would write, and Post for accounts. */
    selectVoucher(row) {
      this.selected = row;
      this.tab = "journal";
      this.actionError = null;
      this.credit = null;
      this.previewLoading = true;

      ApiService.get(`/vouchers/${row.id}/posting-preview`)
        .then(({ data }) => { this.preview = data; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.previewLoading = false; });
    },
    select(row) {
      this.selected = row;
      this.tab = "credit";
      this.actionError = null;
      this.loadCredit();
      this.loadPreview();
    },
    deselect() {
      this.selected = null;
      this.credit = null;
      this.preview = null;
      this.actionError = null;
    },
    loadCredit() {
      this.credit = null;
      if (!this.selected.customer_id) return;

      this.creditLoading = true;
      ApiService.get(`/customers/${this.selected.customer_id}/credit`)
        .then(({ data }) => { this.credit = data; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.creditLoading = false; });
    },
    loadPreview() {
      this.preview = null;
      this.previewLoading = true;
      ApiService.get(`/invoices/${this.selected.id}/posting-preview`)
        .then(({ data }) => { this.preview = data; })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.previewLoading = false; });
    },
    finalize() {
      this.commit(`/invoices/${this.selected.id}/finalize`);
    },
    post() {
      // The buy side posts through its own endpoint — same segregation, different document.
      this.commit(this.view === "vouchers"
        ? `/vouchers/${this.selected.id}/post`
        : `/invoices/${this.selected.id}/post`);
    },
    /**
     * Both commits share this because both can be REFUSED for a reason the user
     * needs to read — a credit breach, a closed period. The server's message is
     * shown verbatim rather than replaced with a generic failure: "no open
     * accounting period covers this document date" is actionable, "something went
     * wrong" is not.
     */
    commit(path) {
      this.busy = true;
      this.actionError = null;

      ApiService.post(path, {})
        .then(({ data }) => {
          const i = this.rows.findIndex((r) => r.id === data.id);
          if (i !== -1) this.$set(this.rows, i, { ...this.rows[i], ...data });
          this.selected = { ...this.selected, ...data };
          this.loadPreview();
        })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
