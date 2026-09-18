<template>
  <div>
    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!--
        §6.7 rule 5 — finalization locks the sheet. Said plainly, because the reason
        edits stop working is not otherwise visible on the screen.
      -->
      <p v-if="sheet.locked" class="fx-warn" role="status">
        Finalized and issued. Corrections need a credit note, not an edit.
      </p>

      <!-- ── Sell ─────────────────────────────────────────────────────────── -->
      <section class="fx-section">
        <h3 class="fx-section__title">Sell — what the client is billed</h3>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Charge</th>
              <th class="fx-num" scope="col">Qty</th>
              <th class="fx-num" scope="col">Rate</th>
              <th class="fx-num" scope="col">Net</th>
              <th v-if="canEdit && !sheet.locked" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in sheet.sell.lines" :key="l.id">
              <!-- Edited in place (user, 2026-09-18), so a rate is corrected where it is read. -->
              <template v-if="editing.side === 'sell' && editing.id === l.id">
                <td><input v-model="editing.description" class="fx-input" type="text" /></td>
                <td class="fx-num"><input v-model.number="editing.quantity" class="fx-input fx-num" type="number" step="0.001" min="0" /></td>
                <td class="fx-num"><input v-model.number="editing.rate" class="fx-input fx-num" type="number" step="0.01" min="0" /></td>
                <td class="fx-num"><input v-model.number="editing.tax_percentage" class="fx-input fx-num" type="number" step="0.01" min="0" max="100" /></td>
                <td class="fx-row-actions">
                  <button class="fx-btn fx-btn--primary" :disabled="busy" @click="saveLine">Save</button>
                  <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="editing = {}">Cancel</button>
                </td>
              </template>
              <template v-else>
                <td>{{ l.description }} <span class="fx-muted">({{ label(l.charge_type) }})</span></td>
                <td class="fx-num"><Figure :value="l.quantity" kind="count" /></td>
                <td class="fx-num"><Figure :value="l.rate" kind="currency" currency-code="INR" /></td>
                <td class="fx-num"><Figure :value="l.net_amount" kind="currency" currency-code="INR" /></td>
                <td v-if="canEdit && !sheet.locked" class="fx-row-actions">
                  <button class="fx-btn fx-btn--ghost" @click="edit('sell', l)">Edit</button>
                  <button class="fx-btn fx-btn--ghost" @click="remove('sell', l.id)">✕</button>
                </td>
              </template>
            </tr>
            <tr v-if="!sheet.sell.lines.length">
              <!-- An empty sell side has two causes, and they need different answers (user, 2026-09-18). -->
              <td colspan="5" class="fx-muted">
                <template v-if="sheet.from_waybill && !sheet.from_waybill.has_rate">
                  No sell lines yet. They are written from the draft waybill
                  <strong>{{ sheet.from_waybill.awb_number }}</strong>, which has no rate yet — open it in FocusAir,
                  enter the rate and charges and save, and the freight line appears here.
                </template>
                <template v-else-if="!sheet.from_waybill">
                  No sell lines yet. Draft the air waybill first (Extraction), or add a line below.
                </template>
                <template v-else>No sell lines yet.</template>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3"><strong>Total</strong></td>
              <td class="fx-num"><Figure :value="sheet.sell.total" kind="currency" currency-code="INR" /></td>
              <td v-if="canEdit && !sheet.locked"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      <!--
        ── Buy ──────────────────────────────────────────────────────────────
        🔴 Rendered ONLY when the server sent it. Sales never reaches this endpoint,
        and the buy block is omitted server-side rather than hidden here — a field left
        out of a template still arrives in the JSON.

        The per-unit buy RATE is absent even for pricing: the line total is what the
        sheet is for, and the rate is what a leak would expose.
      -->
      <section v-if="sheet.buy" class="fx-section">
        <h3 class="fx-section__title">Buy — what we owe suppliers</h3>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Charge</th>
              <th class="fx-num" scope="col">Qty</th>
              <th class="fx-num" scope="col">Net</th>
              <th v-if="canEdit && !sheet.locked" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in sheet.buy.lines" :key="l.id">
              <template v-if="editing.side === 'buy' && editing.id === l.id">
                <td><input v-model="editing.description" class="fx-input" type="text" /></td>
                <td class="fx-num"><input v-model.number="editing.quantity" class="fx-input fx-num" type="number" step="0.001" min="0" /></td>
                <td class="fx-num"><input v-model.number="editing.rate" class="fx-input fx-num" type="number" step="0.01" min="0" /></td>
                <td class="fx-row-actions">
                  <button class="fx-btn fx-btn--primary" :disabled="busy" @click="saveLine">Save</button>
                  <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="editing = {}">Cancel</button>
                </td>
              </template>
              <template v-else>
                <td>{{ l.description }} <span class="fx-muted">({{ label(l.charge_type) }})</span></td>
                <td class="fx-num"><Figure :value="l.quantity" kind="count" /></td>
                <td class="fx-num"><Figure :value="l.net_amount" kind="currency" currency-code="INR" /></td>
                <td v-if="canEdit && !sheet.locked" class="fx-row-actions">
                  <button class="fx-btn fx-btn--ghost" @click="edit('buy', l)">Edit</button>
                  <button class="fx-btn fx-btn--ghost" @click="remove('buy', l.id)">✕</button>
                </td>
              </template>
            </tr>
            <tr v-if="!sheet.buy.lines.length">
              <td colspan="4" class="fx-muted">No buy lines yet.</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><strong>Total</strong></td>
              <td class="fx-num"><Figure :value="sheet.buy.total" kind="currency" currency-code="INR" /></td>
              <td v-if="canEdit && !sheet.locked"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      <!-- ── Margin ───────────────────────────────────────────────────────── -->
      <section v-if="sheet.margin" class="fx-section">
        <h3 class="fx-section__title">Margin</h3>
        <dl class="fx-defs">
          <dt>Value</dt>
          <dd><Figure :value="sheet.margin.value" kind="currency" currency-code="INR" /></dd>
          <dt>Percent</dt>
          <dd>
            <!--
              §7.2 NULL, never −100%, on an unbilled job. "Not billed yet" and "lost
              everything" are opposite facts and must not render alike.
            -->
            <span v-if="sheet.margin.percent === null" class="is-empty" aria-label="Nothing billed yet"></span>
            <span v-else>{{ Number(sheet.margin.percent).toFixed(2) }}%</span>
          </dd>
        </dl>
      </section>

      <!--
        ── To accounts ──────────────────────────────────────────────────────
        🔴 Pricing decides the figures; accounts book them. This hands the sheet over and NOTHING is posted by it
        (user, 2026-09-18: "do not send it to accounts yet — give a send button and a pop-up that confirms the price,
        buy and sell, then send it to accounts").
      -->
      <section class="fx-section">
        <h3 class="fx-section__title">Accounts</h3>
        <p v-if="sheet.sent_to_accounts" class="fx-muted">
          Sent to accounts {{ String(sheet.sent_to_accounts.at).slice(0, 16) }}<template v-if="sheet.sent_to_accounts.by"> by {{ sheet.sent_to_accounts.by }}</template>.
          Sending again replaces what they see.
        </p>
        <p v-else class="fx-muted">Accounts do not see this sheet until you send it.</p>
        <button v-if="canEdit && !sheet.locked" class="fx-btn fx-btn--primary" :disabled="busy || !sheet.sell.lines.length" @click="confirming = true">
          {{ sheet.sent_to_accounts ? "Send again to accounts" : "Send to accounts" }}
        </button>
        <span v-if="!sheet.sell.lines.length" class="fx-muted"> Add at least one sell line first.</span>
      </section>

      <!-- What is being handed over, in figures, before it goes. -->
      <div v-if="confirming" class="fx-modal" role="dialog" aria-modal="true" aria-labelledby="send-accounts-title">
        <div class="fx-modal__panel">
          <header class="fx-modal__head"><h2 id="send-accounts-title" class="fx-modal__title">Send this cost sheet to accounts?</h2></header>
          <div class="fx-modal__body">
            <table class="fx-table">
              <thead><tr><th scope="col">Charge</th><th class="fx-num" scope="col">Qty</th><th class="fx-num" scope="col">Rate</th><th class="fx-num" scope="col">Net</th></tr></thead>
              <tbody>
                <tr><td colspan="4"><strong>Sell — what the client is billed</strong></td></tr>
                <tr v-for="l in sheet.sell.lines" :key="'c-sell-' + l.id">
                  <td>{{ l.description }}</td>
                  <td class="fx-num"><Figure :value="l.quantity" kind="count" /></td>
                  <td class="fx-num"><Figure :value="l.rate" kind="currency" currency-code="INR" /></td>
                  <td class="fx-num"><Figure :value="l.net_amount" kind="currency" currency-code="INR" /></td>
                </tr>
                <tr><td colspan="3"><strong>Sell total</strong></td><td class="fx-num"><Figure :value="sheet.sell.total" kind="currency" currency-code="INR" /></td></tr>
                <template v-if="sheet.buy">
                  <tr><td colspan="4"><strong>Buy — what we owe suppliers</strong></td></tr>
                  <tr v-for="l in sheet.buy.lines" :key="'c-buy-' + l.id">
                    <td>{{ l.description }}</td>
                    <td class="fx-num"><Figure :value="l.quantity" kind="count" /></td>
                    <td class="fx-num">—</td>
                    <td class="fx-num"><Figure :value="l.net_amount" kind="currency" currency-code="INR" /></td>
                  </tr>
                  <tr><td colspan="3"><strong>Buy total</strong></td><td class="fx-num"><Figure :value="sheet.buy.total" kind="currency" currency-code="INR" /></td></tr>
                </template>
                <tr v-if="sheet.margin">
                  <td colspan="3"><strong>Margin</strong></td>
                  <td class="fx-num">
                    <Figure :value="sheet.margin.value" kind="currency" currency-code="INR" />
                    <span v-if="sheet.margin.percent !== null" class="fx-muted"> · {{ sheet.margin.percent }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p class="fx-muted">Accounts finalize and post the invoice; sending does not post anything.</p>
            <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
          </div>
          <footer class="fx-modal__foot">
            <button class="fx-btn" :disabled="busy" @click="confirming = false">Back to the sheet</button>
            <button class="fx-btn fx-btn--primary" :disabled="busy" @click="sendToAccounts">{{ busy ? "Sending…" : "Send to accounts" }}</button>
          </footer>
        </div>
      </div>

      <!-- ── Add a line ───────────────────────────────────────────────────── -->
      <section v-if="canEdit && !sheet.locked" class="fx-section">
        <h3 class="fx-section__title">Add a line</h3>
        <div class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Side</span>
            <select v-model="draft.side" class="fx-input">
              <option value="sell">Sell</option>
              <option value="buy">Buy</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Charge</span>
            <select v-model="draft.charge_type" class="fx-input">
              <option v-for="c in sheet.vocabulary.charge_types" :key="c" :value="c">{{ label(c) }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Description</span>
            <input v-model="draft.description" class="fx-input" type="text" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Qty</span>
            <input v-model.number="draft.quantity" class="fx-input" type="number" step="0.001" min="0" @input="quantityTouched = true" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Rate</span>
            <input v-model.number="draft.rate" class="fx-input" type="number" step="0.01" min="0" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Tax %</span>
            <input v-model.number="draft.tax_percentage" class="fx-input" type="number" step="0.01" min="0" max="100" />
          </label>
          <!-- A cost is owed to somebody: a buy line without a vendor is refused. -->
          <label v-if="draft.side === 'buy'" class="fx-field">
            <span class="fx-field__label">Vendor</span>
            <select v-model="draft.vendor_id" class="fx-input">
              <option value="">Choose…</option>
              <option v-for="p in partners" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </label>
          <button class="fx-btn fx-btn--primary" :disabled="busy || !valid" @click="add">Add</button>
        </div>
        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </section>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "CostSheet",
  components: { Figure },
  props: { jobId: { type: [Number, String], required: true } },
  data: () => ({
    sheet: null, partners: [], loading: true, busy: false, error: null, actionError: null,
    /** The line being changed in place: { side, id, description, quantity, rate, tax_percentage, charge_type }. */
    editing: {},
    /** The confirmation before the sheet goes to accounts. */
    confirming: false,
    draft: { side: "sell", charge_type: "air_freight", description: "",
             quantity: 1, rate: 0, tax_percentage: 18, vendor_id: "" },
    /** True once somebody has typed a quantity, so the waybill's weight never overwrites it. */
    quantityTouched: false,
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Pricing owns the rates; accounts finalizes them. The server re-checks. */
    canEdit() {
      return this.designation === "pricing" || this.designation === "accounts";
    },
    valid() {
      return this.draft.description
        && this.draft.quantity > 0
        && (this.draft.side === "sell" || this.draft.vendor_id);
    },
  },
  created() {
    this.load();
    ApiService.get("/partners")
      .then(({ data }) => { this.partners = data.data || []; })
      .catch(() => { /* the vendor list is optional until a buy line is added */ });
  },
  methods: {
    label(v) {
      return String(v).replace(/_/g, " ");
    },
    load() {
      this.loading = true;
      ApiService.get(`/jobs/${this.jobId}/cost-sheet`)
        .then(({ data }) => {
          this.sheet = data;
          this.error = null;

          // The weight the freight is charged on, so a line typed here starts from the waybill's own figure.
          const weight = data.from_waybill && data.from_waybill.chargeable_weight;
          if (weight && !this.quantityTouched && this.draft.charge_type === "air_freight") this.draft.quantity = weight;
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    add() {
      this.busy = true;
      this.actionError = null;
      const payload = Object.assign({}, this.draft);
      if (payload.side === "sell") delete payload.vendor_id;

      ApiService.post(`/jobs/${this.jobId}/cost-sheet/lines`, payload)
        .then(({ data }) => {
          this.sheet = data;
          this.draft.description = "";
        })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    edit(side, line) {
      this.editing = {
        side, id: line.id, description: line.description, quantity: Number(line.quantity),
        rate: Number(line.rate), tax_percentage: Number(line.tax_percentage || 0), charge_type: line.charge_type,
      };
    },
    saveLine() {
      this.busy = true;
      this.actionError = null;
      const { side, id, ...line } = this.editing;

      ApiService.put(`/jobs/${this.jobId}/cost-sheet/${side}/${id}`, line)
        .then(({ data }) => { this.sheet = data; this.editing = {}; })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    sendToAccounts() {
      this.busy = true;
      this.actionError = null;

      ApiService.post(`/jobs/${this.jobId}/cost-sheet/send`, {})
        .then(({ data }) => { this.sheet = data; this.confirming = false; })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    remove(side, id) {
      this.busy = true;
      ApiService.delete(`/jobs/${this.jobId}/cost-sheet/${side}/${id}`)
        .then(({ data }) => { this.sheet = data; })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
