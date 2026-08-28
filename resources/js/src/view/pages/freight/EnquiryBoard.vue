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

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!rows.length" class="fx-muted">
      No enquiries on this portal yet.
    </p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Number</th>
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
  data: () => ({ rows: [], loading: true, error: null, busyId: null }),
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
      ApiService.get("/enquiries")
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
