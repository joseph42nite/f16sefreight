<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Money out</h1>
      <p class="fx-page-sub">
        {{ current ? current.note : "What we owe, and what we are about to pay." }}
        <router-link to="/today">Today →</router-link>
      </p>
    </header>

    <nav class="fx-pipeline" aria-label="Money out">
      <button
        v-for="s in stages"
        :key="s.key"
        class="fx-pipeline__stage"
        :class="{ 'is-active': stage === s.key, 'is-empty': !s.count, 'is-warning': s.tone === 'warning' && s.count }"
        :aria-current="stage === s.key ? 'step' : null"
        @click="stage = s.key"
      >
        <span class="fx-pipeline__step">{{ s.step }}</span>
        <span class="fx-pipeline__label">{{ s.label }}</span>
        <span class="fx-pipeline__figure"><Figure :value="s.amount" kind="currency" currency-code="INR" /></span>
        <span class="fx-pipeline__count">{{ s.count }} {{ s.count === 1 ? "item" : "items" }}</span>
      </button>
    </nav>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <p class="fx-muted">{{ current ? current.note : "" }}</p>

      <!--
        ── ① Cost to book, as a queue (user, 2026-09-26) ─────────────────────
        🔴 A billed shipment with no cost reads as pure profit. This used to be a count linking to a report; now the
        cost is booked right here, through the cost sheet's own endpoint, so there is still one path that raises a
        voucher. Accounts only — pricing's sheet stays locked once a shipment is billed.
      -->
      <template v-if="stage === 'to_cost'">
        <p v-if="queueLoading" class="fx-muted">Loading…</p>
        <p v-else-if="!queue.rows.length" class="fx-muted">Every billed shipment has its cost booked.</p>
        <template v-else>
          <table class="fx-table">
            <thead>
              <tr>
                <th scope="col">Shipment</th>
                <th scope="col">Client</th>
                <th v-if="branches.length > 1" scope="col">Branch</th>
                <th scope="col">Billed as</th>
                <th scope="col">Billed on</th>
                <th class="fx-num" scope="col">Billed (net of tax)</th>
                <th v-if="queue.can_book" scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="r in queue.rows">
                <tr :key="'q-' + r.job_id" :class="{ 'is-selected': booking && booking.job_id === r.job_id }">
                  <td class="identifier">{{ r.job_no || r.job_id }}</td>
                  <td>{{ r.customer || "—" }}</td>
                  <td v-if="branches.length > 1">{{ r.branch }}</td>
                  <td class="identifier">{{ r.invoices }}</td>
                  <td><Figure :value="r.billed_on" kind="date" /></td>
                  <td class="fx-num"><Figure :value="r.billed" kind="currency" currency-code="INR" /></td>
                  <td v-if="queue.can_book" class="fx-row-actions">
                    <button v-if="!booking || booking.job_id !== r.job_id" class="fx-btn" @click="startBooking(r)">Book cost</button>
                  </td>
                </tr>
                <tr v-if="booking && booking.job_id === r.job_id" :key="'qf-' + r.job_id">
                  <td :colspan="branches.length > 1 ? 7 : 6">
                    <div class="fx-toolbar">
                      <label class="fx-field">
                        <span class="fx-field__label">Supplier</span>
                        <select v-model="booking.vendor_id" class="fx-input">
                          <!-- The airline the AWB names: sent as no vendor, so the cost sheet resolves it itself. -->
                          <option v-if="r.default_supplier" :value="null">{{ r.default_supplier }} (from the AWB)</option>
                          <option v-else :value="null" disabled>Choose…</option>
                          <option v-for="s in (queue.suppliers[r.agent_id] || [])" :key="s.id" :value="s.id">{{ s.name }}</option>
                        </select>
                      </label>
                      <label class="fx-field">
                        <span class="fx-field__label">Charge</span>
                        <select v-model="booking.charge_type" class="fx-input">
                          <option v-for="c in queue.charge_types" :key="c" :value="c">{{ c.replace(/_/g, " ") }}</option>
                        </select>
                      </label>
                      <label class="fx-field">
                        <span class="fx-field__label">Description</span>
                        <input v-model="booking.description" class="fx-input" />
                      </label>
                      <label class="fx-field">
                        <span class="fx-field__label">Amount (net of GST)</span>
                        <input v-model.number="booking.amount" type="number" step="0.01" min="0" class="fx-input fx-num" />
                      </label>
                      <!-- Required, never defaulted: a guessed rate books input credit nobody was charged. -->
                      <label class="fx-field">
                        <span class="fx-field__label">GST %</span>
                        <input v-model="booking.tax_percentage" type="number" step="0.01" min="0" max="100" class="fx-input fx-num" />
                      </label>
                      <button class="fx-btn fx-btn--primary" :disabled="busy || !bookingValid" @click="bookCost">
                        {{ busy ? "Booking…" : "Book it" }}
                      </button>
                      <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="booking = null">Cancel</button>
                    </div>
                    <p class="fx-muted">
                      Raises the supplier's voucher for this shipment, unposted — post it from ② Vouchers. It adds a cost
                      to a shipment already billed; nothing on the client's invoice changes.
                    </p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>
        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </template>

      <!-- ②③ are read on the screens that own them; ④ is the one that pays. -->
      <div v-else-if="stage !== 'due'" class="fx-toolbar">
        <router-link v-if="stage === 'vouchers'" class="fx-btn fx-btn--primary"
                     :to="{ path: '/financials', query: { view: 'vouchers' } }">Open the voucher register</router-link>
        <router-link v-else class="fx-btn fx-btn--primary"
                     :to="{ path: '/financials', query: { view: 'vendors' } }">Open the supplier statements</router-link>
      </div>

      <!-- ── ④ The payment run ─────────────────────────────────────────── -->
      <template v-else>
        <div class="fx-toolbar">
          <label v-if="branches.length > 1" class="fx-field">
            <span class="fx-field__label">Branch</span>
            <select v-model="form.agent_id" class="fx-input" @change="loadDue">
              <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </label>
          <button class="fx-btn" :disabled="busy" @click="showPaid = !showPaid">
            {{ showPaid ? "Back to what is due" : "What has been paid" }}
          </button>
        </div>

        <template v-if="!showPaid">
          <p v-if="!vouchers.length" class="fx-muted">Nothing is owed to suppliers.</p>
          <template v-else>
            <table class="fx-table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Voucher</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">Shipment</th>
                  <th scope="col">Dated</th>
                  <th scope="col">Age</th>
                  <th class="fx-num" scope="col">Outstanding</th>
                  <th class="fx-num" scope="col">Pay now</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="v in vouchers" :key="'v-' + v.id" :class="{ 'is-selected': picked[v.id] }">
                  <td>
                    <!-- 🔴 Paid only once posted: paying an unposted voucher takes the payable below zero. -->
                    <input type="checkbox" :checked="!!picked[v.id]" :aria-label="'Pay ' + v.voucher_no"
                           :disabled="!v.posted" @change="toggle(v, $event.target.checked)" />
                  </td>
                  <td class="identifier">
                    {{ v.voucher_no }}
                    <div v-if="!v.posted" class="fx-muted">
                      Not posted —
                      <router-link :to="{ path: '/financials', query: { view: 'vouchers' } }">post it first</router-link>
                    </div>
                  </td>
                  <td>{{ v.vendor }}</td>
                  <td class="identifier">{{ v.job_no || "—" }}</td>
                  <td>
                    <Figure :value="v.due_on" kind="date" />
                    <!-- ⚠️ Said, not hidden: this voucher had no due date and is aged from the day it was raised. -->
                    <span v-if="v.due_assumed" class="fx-muted">(assumed)</span>
                  </td>
                  <td>{{ v.days_old }} days</td>
                  <td class="fx-num"><Figure :value="v.outstanding" kind="currency" currency-code="INR" /></td>
                  <td>
                    <input v-model.number="amounts[v.id]" type="number" step="0.01" min="0"
                           class="fx-input fx-num" :disabled="!picked[v.id]" />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6"><strong>{{ chosen.length }} chosen</strong></td>
                  <td class="fx-num"><strong><Figure :value="total" kind="currency" currency-code="INR" /></strong></td>
                  <td class="fx-num"><strong><Figure :value="payingTotal" kind="currency" currency-code="INR" /></strong></td>
                </tr>
              </tfoot>
            </table>

            <!-- 🔴 One payment per SUPPLIER: each is a separate transfer to a separate account. -->
            <p class="fx-muted">
              {{ payeeCount }} supplier{{ payeeCount === 1 ? "" : "s" }} in this run — one payment each, because
              each is its own bank transfer.
            </p>

            <div class="fx-toolbar">
              <label class="fx-field">
                <span class="fx-field__label">Payment date</span>
                <input v-model="form.payment_date" type="date" class="fx-input" />
              </label>
              <label class="fx-field">
                <span class="fx-field__label">How</span>
                <select v-model="form.mode" class="fx-input">
                  <option v-for="m in modes" :key="m" :value="m">{{ m.replace(/_/g, " ") }}</option>
                </select>
              </label>
              <label class="fx-field">
                <span class="fx-field__label">Our reference</span>
                <input v-model="form.reference" class="fx-input" placeholder="batch or UTR" />
              </label>
              <button v-if="canPay" class="fx-btn fx-btn--primary"
                      :disabled="busy || !chosen.length || overAllocated" @click="confirming = true">
                {{ busy ? "Building…" : "Build the run" }}
              </button>
            </div>
            <p v-if="overAllocated" class="fx-error" role="alert">
              One of those is more than the voucher still owes.
            </p>
          </template>
        </template>

        <!-- What has been paid already. -->
        <template v-else>
          <p v-if="!payments.length" class="fx-muted">No payment has been made.</p>
          <table v-else class="fx-table">
            <thead>
              <tr>
                <th scope="col">Payment</th>
                <th scope="col">Date</th>
                <th scope="col">Supplier</th>
                <th scope="col">How</th>
                <th scope="col">Settles</th>
                <th class="fx-num" scope="col">Amount</th>
                <!-- 🔴 The vendor's own book is settled at `amount`, but that is not what the bank moves —
                     TDS withheld here never leaves this desk's account at all. Two figures, not one. -->
                <th class="fx-num" scope="col">TDS withheld</th>
                <th class="fx-num" scope="col">Transfer</th>
                <th scope="col">Posted</th>
                <th v-if="canPay" scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in payments" :key="'p-' + p.id">
                <td class="identifier">{{ p.payment_no }}</td>
                <td><Figure :value="p.payment_date" kind="date" /></td>
                <td>{{ p.payee || "—" }}</td>
                <td>{{ (p.mode || "").replace(/_/g, " ") }}</td>
                <td class="fx-muted">{{ p.allocations.map((a) => a.voucher_no).join(", ") || "—" }}</td>
                <td class="fx-num"><Figure :value="p.amount" kind="currency" currency-code="INR" /></td>
                <td class="fx-num">
                  <Figure v-if="Number(p.tds_amount) > 0" :value="p.tds_amount" kind="currency" currency-code="INR" />
                  <span v-else class="fx-muted">—</span>
                </td>
                <td class="fx-num"><Figure :value="Number(p.amount) - Number(p.tds_amount || 0)" kind="currency" currency-code="INR" /></td>
                <td><StatusChip :value="p.is_posted ? 'posted' : 'unposted'" /></td>
                <td v-if="canPay" class="fx-row-actions">
                  <button v-if="!p.is_posted" class="fx-btn" :disabled="busy" @click="post(p)">Post</button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        <p v-if="lastRun" class="fx-notice" role="status">
          {{ lastRun.payments.length }} payment(s) raised as {{ lastRun.run_ref }},
          {{ money(lastRun.total) }} in total. Post each one to move it through the ledger.
          <!-- 🔴 The desk transfers `to_transfer`, not `total` — the difference is `tds_withheld`, owed to
               the government by the 7th, not to any supplier here. Said every time it is not zero, because
               the one place this run should be silent about it is nowhere. -->
          <template v-if="lastRun.tds_withheld > 0">
            {{ money(lastRun.tds_withheld) }} of that is TDS withheld — transfer {{ money(lastRun.to_transfer) }}, not the total.
          </template>
        </p>
      </template>
    </template>

    <!-- Paying is money leaving, so it asks — with the supplier breakdown in front of you. -->
    <div v-if="confirming" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="run-title">
      <div class="fx-modal__panel">
        <header class="fx-modal__head">
          <h2 id="run-title" class="fx-modal__title">Pay {{ money(payingTotal) }}?</h2>
        </header>
        <div class="fx-modal__body">
          <table class="fx-table">
            <thead>
              <tr><th scope="col">Supplier</th><th class="fx-num" scope="col">Vouchers</th><th class="fx-num" scope="col">Amount</th></tr>
            </thead>
            <tbody>
              <tr v-for="p in payees" :key="'pay-' + p.vendor_id">
                <td>{{ p.vendor }}</td>
                <td class="fx-num">{{ p.count }}</td>
                <td class="fx-num"><Figure :value="p.amount" kind="currency" currency-code="INR" /></td>
              </tr>
            </tbody>
          </table>
          <p class="fx-muted">
            One payment each. Nothing leaves a bank account from here — this records what you are paying, and each
            payment posts to the ledger separately.
          </p>
          <!-- 🔴 Said, not computed here: withholding depends on each vendor's section, thresholds already
               crossed this year and any s.197 certificate, which only the server can work out correctly —
               and the figure it actually withholds is shown once the run is raised, below. -->
          <p class="fx-muted">
            A vendor with a TDS section set may have tax withheld from this payment; the exact amount is set
            when the run is raised, not before.
          </p>
          <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
        </div>
        <footer class="fx-modal__foot">
          <button class="fx-btn" :disabled="busy" @click="confirming = false">Cancel</button>
          <button class="fx-btn fx-btn--primary" :disabled="busy" @click="build">Raise the payments</button>
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

export default {
  name: "MoneyOut",
  components: { Figure, StatusChip },
  data: () => ({
    stages: [], stage: "due", branches: [],
    vouchers: [], total: 0, payments: [], modes: [],
    picked: {}, amounts: {},
    form: { agent_id: null, payment_date: new Date().toISOString().slice(0, 10), mode: "bank_transfer", reference: "" },
    showPaid: false, confirming: false, lastRun: null,
    /** ① Cost to book, and the one shipment whose cost is being booked (user, 2026-09-26). */
    queue: { rows: [], suppliers: {}, charge_types: [], can_book: false }, queueLoading: false, booking: null,
    loading: true, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Accounts pay. The Boss reads what is owed. */
    canPay() {
      return this.designation === "accounts";
    },
    current() {
      return this.stages.find((s) => s.key === this.stage) || null;
    },
    chosen() {
      return this.vouchers.filter((v) => this.picked[v.id]);
    },
    payingTotal() {
      return this.chosen.reduce((sum, v) => sum + (Number(this.amounts[v.id]) || 0), 0);
    },
    overAllocated() {
      return this.chosen.some((v) => (Number(this.amounts[v.id]) || 0) > Number(v.outstanding) + 0.009);
    },
    /** The run, grouped the way it will actually be raised. */
    payees() {
      const byVendor = {};
      this.chosen.forEach((v) => {
        byVendor[v.vendor_id] ??= { vendor_id: v.vendor_id, vendor: v.vendor, count: 0, amount: 0 };
        byVendor[v.vendor_id].count++;
        byVendor[v.vendor_id].amount += Number(this.amounts[v.id]) || 0;
      });

      return Object.values(byVendor);
    },
    /** A supplier (named, or the AWB's airline), a description, an amount, and a GST rate somebody actually typed. */
    bookingValid() {
      const b = this.booking;
      if (!b) return false;
      const row = this.queue.rows.find((r) => r.job_id === b.job_id);
      const hasSupplier = b.vendor_id !== null || !!(row && row.default_supplier);

      return hasSupplier && b.description.trim() !== "" && Number(b.amount) > 0
        && b.tax_percentage !== "" && Number(b.tax_percentage) >= 0 && Number(b.tax_percentage) <= 100;
    },
    payeeCount() {
      return this.payees.length;
    },
  },
  created() {
    this.load();
  },
  methods: {
    money(value) {
      return "INR " + Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
    },
    load() {
      this.loading = true;
      ApiService.get("/money-out/stages")
        .then(({ data }) => {
          this.stages = data.stages || [];
          this.branches = data.branches || [];
          if (!this.form.agent_id && this.branches.length) this.form.agent_id = this.branches[0].id;
          this.error = null;

          return Promise.all([this.loadDue(), this.loadPayments(), this.loadQueue()]);
        })
        .catch((e) => {
          this.error = (e.response && e.response.data && e.response.data.error) || "Money out could not be loaded.";
        })
        .finally(() => { this.loading = false; });
    },
    loadDue() {
      return ApiService.get("/payments/due" + (this.form.agent_id ? "?agent_id=" + this.form.agent_id : ""))
        .then(({ data }) => {
          this.vouchers = data.vouchers || [];
          this.total = data.total || 0;
          this.picked = {};
          this.amounts = {};
        })
        .catch(() => {});
    },
    loadPayments() {
      return ApiService.get("/payments")
        .then(({ data }) => { this.payments = data.rows || []; this.modes = data.modes || []; })
        .catch(() => {});
    },
    /** Ticking a voucher fills in its full balance — the common case is paying it off. */
    loadQueue() {
      this.queueLoading = true;
      return ApiService.get("/money-out/to-cost")
        .then(({ data }) => {
          this.queue = { rows: data.rows || [], suppliers: data.suppliers || {},
                         charge_types: data.charge_types || [], can_book: !!data.can_book };
        })
        .catch(() => {})
        .finally(() => { this.queueLoading = false; });
    },
    startBooking(row) {
      const charge = row.transport_mode === "air" ? "air_freight" : (row.transport_mode === "sea" ? "ocean_freight" : "miscellaneous");
      this.actionError = null;
      this.booking = { job_id: row.job_id, vendor_id: null, charge_type: charge,
                       description: charge.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase()),
                       amount: null, tax_percentage: "" };
    },
    /** Through the cost sheet's own endpoint — one path raises a voucher, whoever calls it. */
    bookCost() {
      const b = this.booking;
      const body = { side: "buy", charge_type: b.charge_type, description: b.description.trim(),
                     quantity: 1, rate: Number(b.amount), tax_percentage: Number(b.tax_percentage) };
      if (b.vendor_id !== null) body.vendor_id = b.vendor_id;

      this.busy = true;
      this.actionError = null;
      ApiService.post(`/jobs/${b.job_id}/cost-sheet/lines`, body)
        .then(() => { this.booking = null; this.load(); })
        .catch((e) => {
          const d = (e.response && e.response.data) || {};
          this.actionError = d.error || d.message || "The cost could not be booked.";
        })
        .finally(() => { this.busy = false; });
    },
    toggle(voucher, on) {
      this.$set(this.picked, voucher.id, on);
      this.$set(this.amounts, voucher.id, on ? Number(voucher.outstanding) : 0);
    },
    build() {
      this.busy = true;
      this.actionError = null;

      ApiService.post("/payments/run", {
        ...this.form,
        allocations: this.chosen.map((v) => ({ purchase_voucher_id: v.id, amount: Number(this.amounts[v.id]) })),
      })
        .then(({ data }) => { this.lastRun = data; this.confirming = false; this.load(); })
        .catch((e) => {
          this.actionError = (e.response && e.response.data && e.response.data.error) || "The run could not be built.";
        })
        .finally(() => { this.busy = false; });
    },
    post(payment) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/payments/${payment.id}/post`, {})
        .then(() => this.load())
        .catch((e) => {
          this.actionError = (e.response && e.response.data && e.response.data.error) || "It would not post.";
        })
        .finally(() => { this.busy = false; });
    },
  },
};
</script>
