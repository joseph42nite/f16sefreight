<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Enquiries</h1>
      <p class="fx-page-sub">
        The pre-conversion pool for
        <strong>{{ portalLabel || 'all modes' }}</strong>.
        Unconverted rows are the funnel — they are never deleted.
      </p>
    </header>

    <!--
      🔍 ONE box over BOTH identities. An operator looking for "globex" should not have to
      know whether that client was ever onboarded as a customer — the server matches the
      customer name, its email domain, and the address the conversation arrived from, so
      the row appears either way.
    -->
    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Client</span>
        <input
          v-model="client"
          class="fx-input"
          type="search"
          placeholder="Name or domain…"
          @keyup.enter="load"
        />
      </label>
      <button class="fx-btn" @click="load">Search</button>
      <button v-if="client" class="fx-btn fx-btn--ghost" @click="client = ''; load()">Clear</button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!rows.length" class="fx-muted">
      No enquiries on this portal yet.
    </p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Number</th>
          <th scope="col">Client</th>
          <th scope="col">Status</th>
          <th scope="col">Lane</th>
          <th scope="col" class="fx-num">Pieces</th>
          <th scope="col" class="fx-num">Weight</th>
          <th scope="col" class="fx-num">Quoted</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="identifier">{{ row.enquiry_no }}</td>
          <td>
            <!--
              🔴 The name where the client is known, the sending DOMAIN where it is not.
              A brand-new prospect has no customer row yet, and a blank there reads as
              "nobody" when the truth is "not onboarded". The domain is what the operator
              actually recognises in the meantime.
            -->
            <span v-if="row.client_label">{{ row.client_label }}</span>
            <span v-else class="is-empty" aria-label="No client recorded"></span>

            <!-- ⚠️ Below Command the server omits customer_id entirely, so there is
                 nothing to link to and no link is offered. -->
            <span
              v-if="row.client_domain && row.client_domain !== row.client_label"
              class="fx-muted fx-enq__domain"
            >{{ row.client_domain }}</span>
          </td>
          <td><StatusChip :value="row.status" /></td>
          <td>
            <!-- §4.1 NULL is not zero — an unknown lane renders as an em dash, never
                 as a blank that reads like "no lane". -->
            <span v-if="row.origin_code && row.dest_code" class="identifier">
              {{ row.origin_code }} → {{ row.dest_code }}
            </span>
            <span v-else class="is-empty" aria-label="Not recorded"></span>
          </td>
          <td class="fx-num numeric"><Figure :value="row.extracted_pieces" kind="count" /></td>
          <td class="fx-num numeric"><Figure :value="row.extracted_weight" kind="weight" /></td>
          <td class="fx-num numeric"><Figure :value="row.quoted_amount" kind="currency" :currency-code="row.quoted_currency" /></td>
          <td class="fx-row-actions">
            <button
              v-if="canConvert && row.status !== 'converted' && row.status !== 'lost'"
              class="fx-btn fx-btn--ghost"
              :disabled="busyId === row.id"
              @click="convert(row)"
            >
              {{ busyId === row.id ? 'Converting…' : 'Confirm shipment' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "EnquiryBoard",
  components: { StatusChip, Figure },
  data: () => ({
    client: "", rows: [], loading: true, error: null, busyId: null }),
  computed: {
    ...mapGetters(["portalLabel", "can"]),
    canConvert() {
      // Mirrors the server gate. Convenience only — the API re-checks it.
      return this.can(["pricing"], "tactical");
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      // The client filter is a server-side search across the customer record AND the
      // sending domain — see EnquiryController::index.
      ApiService.get("/enquiries" + (this.client ? "?client=" + encodeURIComponent(this.client) : ""))
        .then(({ data }) => {
          this.rows = data.data || [];
        })
        .catch((e) => {
          this.error = this.readable(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    convert(row) {
      this.busyId = row.id;
      ApiService.post(`/enquiries/${row.id}/convert`, {})
        .then(() => this.load())
        .catch((e) => {
          this.error = this.readable(e);
        })
        .finally(() => {
          this.busyId = null;
        });
    },
    /* §11.3 — surface the server's reason, not a generic failure. The API returns a
       `reason` code precisely so the UI can be specific about what went wrong. */
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
