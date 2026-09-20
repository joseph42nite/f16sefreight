<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Billing</h1>
      <p class="fx-page-sub">
        {{ subtitleForView }}
        <router-link to="/financials">Financials →</router-link>
      </p>
    </header>

    <!--
      The billing desk's own page (user, 2026-09-19). Every sales document in one register — invoice, debit note,
      credit note, brokerage, consol — because they share a table, a client and a shipment, and a desk that has to
      open five screens to answer "what have we billed them?" opens none of them.
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

    <!-- ── Documents: the register over all five types ───────────────────── -->
    <template v-if="view === 'documents'">
      <div class="fx-toolbar">
        <label class="fx-field">
          <span class="fx-field__label">Document</span>
          <select v-model="filters.type" class="fx-input" @change="load">
            <option value="">All documents</option>
            <option v-for="(meta, key) in types" :key="key" :value="key">{{ meta.label }}</option>
          </select>
        </label>

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
      </div>

      <div class="fx-toolbar">
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
        <label class="fx-checkbox">
          <input v-model="filters.exclude_credit_notes" type="checkbox" @change="load" />
          Exclude credit notes
        </label>
      </div>

      <!-- Multiple Bill Printing: whatever is ticked, printed or mailed in one go. -->
      <div class="fx-toolbar">
        <button class="fx-btn" :disabled="busy || !rows.length" @click="toggleAll">
          {{ allChosen ? "Clear selection" : "Check all" }}
        </button>
        <button class="fx-btn" :disabled="busy || !chosen.length" @click="printBills">
          {{ busy ? "Working…" : `Print ${chosen.length || ""}`.trim() }}
        </button>
        <button v-if="canPost" class="fx-btn" :disabled="busy || !chosen.length" @click="mailBills">Send mail</button>
        <button class="fx-btn" :disabled="busy" @click="exportCsv">Data export</button>
        <button v-if="canPost" class="fx-btn fx-btn--primary" @click="openRaise('debit_note')">Raise a document</button>
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
              <th scope="col">Type</th>
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
            <tr v-for="row in rows" :key="'d-' + row.id" :class="{ 'is-selected': picked[row.id] }">
              <td><input v-model="picked[row.id]" type="checkbox" :aria-label="'Choose ' + row.invoice_no" /></td>
              <td class="identifier">{{ row.invoice_no }}</td>
              <td><Figure :value="row.document_date" kind="date" /></td>
              <td>{{ typeLabel(row.type) }}</td>
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
              <td colspan="8" class="fx-num"><strong>{{ totals.count }} document(s)</strong></td>
              <td class="fx-num"><strong><Figure :value="totals.amount_inr" kind="currency" currency-code="INR" /></strong></td>
              <td class="fx-num"><strong><Figure :value="totals.outstanding_inr" kind="currency" currency-code="INR" /></strong></td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>
        <!-- Only the INR column totals: a column of mixed currencies has no sum. -->
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

    <!-- Raise a document: a note against a bill, or a brokerage or consol bill on a shipment. -->
    <div v-if="raise" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="raise-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="raise-title" class="fx-modal__title">Raise a document</h2>
        </header>
        <div class="fx-modal__body">
          <label class="fx-field">
            <span class="fx-field__label">Document</span>
            <select v-model="raise.type" class="fx-input" @change="raise.parent_invoice_id = null">
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
            <label class="fx-field">
              <span class="fx-field__label">Billed to</span>
              <select v-model="raise.partner_id" class="fx-input">
                <option :value="null">Choose…</option>
                <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }}</option>
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

const STATUSES = ["draft", "finalized", "sent", "partially_paid", "paid", "void"];

/** Logi-Sys's Billing section, as the three things this desk actually does (user, 2026-09-19). */
const VIEWS = [
  { key: "documents", label: "Documents" },
  { key: "receipts", label: "Receipts" },
  { key: "einvoice", label: "E-Invoice" },
];

export default {
  name: "Billing",
  components: { Figure, StatusChip },
  data: () => ({
    view: "documents", VIEWS, STATUSES,
    rows: [], totals: { count: 0, amount_inr: 0, outstanding_inr: 0 },
    branches: [], types: {}, currencies: [], raisedBy: [],
    filters: { type: "", agent_id: null, from: "", to: "", q: "", status: "", currency: "",
               created_by: null, sort: "date", outstanding: false, exclude_credit_notes: false },
    /** Which rows are ticked for printing or mailing. */
    picked: {},
    receipts: [], modes: [], eInvoices: [], eInvoiceNote: "",
    /** The document being raised, the receipt being recorded, the IRN being typed. */
    raise: null, creditRoom: null, jobs: [], partners: [],
    receipt: null, openDocuments: [], allocation: {}, resolution: {}, clients: [],
    irnFor: null,
    loading: true, busy: false, error: null, actionError: null, mailResult: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only accounts raise and send a bill. The Boss reads the register. */
    canPost() {
      return this.designation === "accounts";
    },
    subtitleForView() {
      return {
        documents: "Every sales document this branch has raised — invoices, notes, brokerage and consol — with what it was billed in and what it is worth in INR.",
        receipts: "Money received, and the documents each payment settled.",
        einvoice: "What has been through the invoice registration portal, and what is still waiting.",
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

      return linesOk && (this.isNote
        ? !!this.raise.parent_invoice_id && !!(this.raise.reason || "").trim()
        : !!this.raise.job_id && !!this.raise.partner_id);
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
    this.load();
  },
  methods: {
    showView(key) {
      this.view = key;
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
    lineNet(line) {
      const amount = (Number(line.quantity) || 0) * (Number(line.rate) || 0);

      return Math.round(amount * (1 + (Number(line.tax_percentage) || 0) / 100) * 100) / 100;
    },
    blankLine() {
      return { description: "", hsn_sac_code: "", quantity: 1, rate: 0, tax_percentage: 18 };
    },
    query() {
      const params = [];
      if (this.filters.type) params.push("types[]=" + this.filters.type);
      ["agent_id", "from", "to", "q", "status", "currency", "created_by", "sort"].forEach((key) => {
        if (this.filters[key]) params.push(key + "=" + encodeURIComponent(this.filters[key]));
      });
      if (this.filters.outstanding) params.push("outstanding=1");
      if (this.filters.exclude_credit_notes) params.push("exclude_credit_notes=1");

      return params.length ? "?" + params.join("&") : "";
    },
    load() {
      this.loading = true;

      const path = { receipts: "/receipts", einvoice: "/billing/e-invoice" }[this.view] || "/billing";

      ApiService.get(path + (this.view === "documents" ? this.query() : ""))
        .then(({ data }) => {
          if (this.view === "documents") {
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
    toggleAll() {
      const on = !this.allChosen;
      const picked = {};
      this.rows.forEach((r) => { picked[r.id] = on; });
      this.picked = picked;
    },
    /** The bills come back as a PDF, so they are fetched as bytes and opened, never linked to. */
    printBills() {
      this.busy = true;
      this.actionError = null;
      ApiService.postForFile("/billing/print", { ids: this.chosen })
        .then(({ data }) => this.openFile(data, "application/pdf"))
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    exportCsv() {
      this.busy = true;
      ApiService.query("/billing/export" + this.query(), { responseType: "blob" })
        .then(({ data }) => this.openFile(data, "text/csv", "billing.csv"))
        .catch((e) => { this.actionError = this.messageFor(e); })
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
    openRaise(type) {
      this.actionError = null;
      this.creditRoom = null;
      this.raise = { type, parent_invoice_id: null, job_id: null, partner_id: null, basis: "flat_rate",
                     reason: "", narration: "", lines: [this.blankLine()] };

      ApiService.get("/jobs?per_page=50").then(({ data }) => { this.jobs = data.data || data.rows || []; }).catch(() => {});
      ApiService.get("/partners").then(({ data }) => { this.partners = data.data || []; }).catch(() => {});
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
        .then(() => { this.raise = null; this.load(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
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
        .then(() => { this.receipt = null; this.view = "receipts"; this.load(); })
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
    /* The server's own message, verbatim: "only 4,000 is left to credit" is actionable
       where "something went wrong" sends somebody to ask a colleague. */
    messageFor(e) {
      return (e.response && e.response.data && e.response.data.error) || "Something went wrong. Try again.";
    },
  },
};
</script>
