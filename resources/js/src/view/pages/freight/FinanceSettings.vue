<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Finance settings</h1>
      <p class="fx-page-sub">
        The chart of accounts the ledger posts into, and the rates quoted to clients and agreed with suppliers.
      </p>
    </header>

    <div v-if="branches.length > 1" class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Branch</span>
        <select v-model="branchId" class="fx-input" @change="load">
          <option :value="null">All branches</option>
          <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!-- ── Chart of accounts ─────────────────────────────────────────── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Chart of accounts</h2>
        <p class="fx-muted">
          Where each posting lands. An account appears the first time something is posted to it; name it here so the
          reports read plainly. A code is never changed — the ledger points at it.
        </p>

        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Code</th>
              <th scope="col">Name</th>
              <th v-if="branches.length > 1" scope="col">Branch</th>
              <th class="fx-num" scope="col">Postings</th>
              <th v-if="canEdit" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in accounts" :key="'a-' + a.id">
              <td class="identifier">{{ a.account_code }}</td>
              <td>
                <input v-if="editing === a.id" v-model="editName" class="fx-input" />
                <span v-else>{{ a.account_name }}</span>
              </td>
              <td v-if="branches.length > 1">{{ a.branch }}</td>
              <td class="fx-num">{{ a.postings }}</td>
              <td v-if="canEdit" class="fx-row-actions">
                <template v-if="editing === a.id">
                  <button class="fx-btn fx-btn--primary" :disabled="busy" @click="rename(a)">Save</button>
                  <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="editing = null">Cancel</button>
                </template>
                <button v-else class="fx-btn fx-btn--ghost" @click="startRename(a)">Rename</button>
              </td>
            </tr>
            <tr v-if="!accounts.length">
              <td colspan="5" class="fx-muted">No accounts yet. They appear as soon as something is posted.</td>
            </tr>
          </tbody>
        </table>

        <div v-if="canEdit" class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Branch</span>
            <select v-model.number="newAccount.agent_id" class="fx-input">
              <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Code</span>
            <input v-model="newAccount.account_code" class="fx-input" placeholder="4000-Freight-Revenue" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Name</span>
            <input v-model="newAccount.account_name" class="fx-input" placeholder="Freight revenue" />
          </label>
          <button class="fx-btn" :disabled="busy || !newAccount.account_code || !newAccount.account_name" @click="addAccount">Add account</button>
        </div>
      </section>

      <!-- ── Rate cards ────────────────────────────────────────────────── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Rate cards</h2>
        <p class="fx-muted">A rate agreed with one client or supplier, for a kind of charge and a weight break.</p>

        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Charge</th>
              <th scope="col">Party</th>
              <th scope="col">Weight break</th>
              <th class="fx-num" scope="col">Rate</th>
              <th scope="col">Valid</th>
              <th v-if="branches.length > 1" scope="col">Branch</th>
              <th v-if="canEdit" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rateCards" :key="'r-' + r.id">
              <td>{{ String(r.charge_type).replace(/_/g, " ") }}</td>
              <td>{{ r.party || r.party_type }}</td>
              <td>{{ r.weight_break_from || 0 }}–{{ r.weight_break_to || "∞" }} kg</td>
              <td class="fx-num">{{ r.currency }} {{ r.rate }}</td>
              <td>
                <Figure :value="r.valid_from" kind="date" />
                <template v-if="r.valid_to"> – <Figure :value="r.valid_to" kind="date" /></template>
              </td>
              <td v-if="branches.length > 1">{{ r.branch }}</td>
              <td v-if="canEdit" class="fx-row-actions">
                <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="removeRate(r)">✕</button>
              </td>
            </tr>
            <tr v-if="!rateCards.length">
              <td colspan="7" class="fx-muted">No rate cards yet.</td>
            </tr>
          </tbody>
        </table>

        <div v-if="canEdit" class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Branch</span>
            <select v-model.number="newRate.agent_id" class="fx-input">
              <option v-for="b in branches" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Charge</span>
            <input v-model="newRate.charge_type" class="fx-input" placeholder="air_freight" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Party</span>
            <select v-model="newRate.party_type" class="fx-input" @change="newRate.party_id = null">
              <option value="customer">Client</option>
              <option value="partner">Supplier</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">{{ newRate.party_type === "customer" ? "Client" : "Supplier" }}</span>
            <select v-model.number="newRate.party_id" class="fx-input">
              <option :value="null">Choose…</option>
              <option v-for="p in newRate.party_type === 'customer' ? customers : partners" :key="p.id" :value="p.id">{{ p.name }}</option>
            </select>
          </label>
          <label class="fx-field">
            <span class="fx-field__label">From kg</span>
            <input v-model.number="newRate.weight_break_from" class="fx-input" type="number" min="0" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">To kg</span>
            <input v-model.number="newRate.weight_break_to" class="fx-input" type="number" min="0" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Rate</span>
            <input v-model.number="newRate.rate" class="fx-input" type="number" step="0.01" min="0" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Valid from</span>
            <input v-model="newRate.valid_from" class="fx-input" type="date" />
          </label>
          <label class="fx-field">
            <span class="fx-field__label">Valid to</span>
            <input v-model="newRate.valid_to" class="fx-input" type="date" />
          </label>
          <button class="fx-btn" :disabled="busy || !rateValid" @click="addRate">Add rate</button>
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

/** Settings → Finance (PRD §2.4): the chart of accounts and the rate cards, per branch (user, 2026-09-18). */
export default {
  name: "FinanceSettings",
  components: { Figure },
  data: () => ({
    accounts: [], rateCards: [], branches: [], branchId: null,
    customers: [], partners: [],
    loading: true, busy: false, error: null, actionError: null,
    editing: null, editName: "",
    newAccount: { agent_id: null, account_code: "", account_name: "" },
    newRate: { agent_id: null, charge_type: "air_freight", party_type: "customer", party_id: null,
               weight_break_from: 0, weight_break_to: 1000, rate: 0, currency: "INR", valid_from: "", valid_to: "" },
  }),
  computed: {
    ...mapGetters(["designation"]),
    /* Accounts keeps the ledger; the Boss may set the rates their branches quote. */
    canEdit() {
      return this.designation === "accounts" || this.designation === "boss";
    },
    rateValid() {
      const r = this.newRate;
      return r.agent_id && r.charge_type && r.party_id && r.rate > 0 && r.valid_from && r.valid_to
        && r.valid_to >= r.valid_from && r.weight_break_to >= r.weight_break_from;
    },
  },
  created() {
    this.load();
    ApiService.get("/customers").then(({ data }) => { this.customers = data.data || []; }).catch(() => {});
    ApiService.get("/partners").then(({ data }) => { this.partners = data.data || []; }).catch(() => {});
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get("/finance-settings" + (this.branchId ? "?agent_id=" + this.branchId : ""))
        .then(({ data }) => { this.take(data); this.error = null; })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    take(data) {
      this.accounts = data.accounts || [];
      this.rateCards = data.rate_cards || [];
      this.branches = data.branches || [];
      if (!this.newAccount.agent_id && this.branches.length) {
        this.newAccount.agent_id = this.branches[0].id;
        this.newRate.agent_id = this.branches[0].id;
      }
    },
    startRename(account) {
      this.editing = account.id;
      this.editName = account.account_name;
    },
    rename(account) {
      this.save("/finance-settings/accounts", {
        agent_id: account.agent_id, account_code: account.account_code, account_name: this.editName,
      }, () => { this.editing = null; });
    },
    addAccount() {
      this.save("/finance-settings/accounts", this.newAccount, () => {
        this.newAccount = { ...this.newAccount, account_code: "", account_name: "" };
      });
    },
    addRate() {
      this.save("/finance-settings/rate-cards", this.newRate, () => {
        this.newRate = { ...this.newRate, party_id: null, rate: 0 };
      });
    },
    removeRate(card) {
      this.busy = true;
      this.actionError = null;
      ApiService.delete(`/finance-settings/rate-cards/${card.id}`)
        .then(({ data }) => this.take(data))
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    save(path, payload, done) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(path, payload)
        .then(({ data }) => { this.take(data); done(); })
        .catch((e) => { this.actionError = this.messageFor(e); })
        .finally(() => { this.busy = false; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      const invalid = d.errors && Object.values(d.errors)[0];
      return (invalid && invalid[0]) || d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
