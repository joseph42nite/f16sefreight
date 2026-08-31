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
              <td>{{ l.description }} <span class="fx-muted">({{ label(l.charge_type) }})</span></td>
              <td class="fx-num"><Figure :value="l.quantity" kind="count" /></td>
              <td class="fx-num"><Figure :value="l.rate" kind="currency" currency-code="INR" /></td>
              <td class="fx-num"><Figure :value="l.net_amount" kind="currency" currency-code="INR" /></td>
              <td v-if="canEdit && !sheet.locked" class="fx-row-actions">
                <button class="fx-btn fx-btn--ghost" @click="remove('sell', l.id)">✕</button>
              </td>
            </tr>
            <tr v-if="!sheet.sell.lines.length">
              <td colspan="5" class="fx-muted">No sell lines yet.</td>
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
              <td>{{ l.description }} <span class="fx-muted">({{ label(l.charge_type) }})</span></td>
              <td class="fx-num"><Figure :value="l.quantity" kind="count" /></td>
              <td class="fx-num"><Figure :value="l.net_amount" kind="currency" currency-code="INR" /></td>
              <td v-if="canEdit && !sheet.locked" class="fx-row-actions">
                <button class="fx-btn fx-btn--ghost" @click="remove('buy', l.id)">✕</button>
              </td>
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
            <input v-model.number="draft.quantity" class="fx-input" type="number" step="0.001" min="0" />
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
    draft: { side: "sell", charge_type: "air_freight", description: "",
             quantity: 1, rate: 0, tax_percentage: 18, vendor_id: "" },
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
        .then(({ data }) => { this.sheet = data; this.error = null; })
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
