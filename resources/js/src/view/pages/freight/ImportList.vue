<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">{{ mode === "air" ? "Air Import" : "Sea Import" }}</h1>
      <p class="fx-page-sub">
        Cargo arriving: the consol and its houses, the IGM, the arrival notice and the delivery order.
      </p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Find</span>
        <input v-model.trim="q" class="fx-input" :placeholder="mode === 'air' ? 'Job no or MAWB' : 'Job no'" @keyup.enter="load" />
      </label>
      <button class="fx-btn" @click="load">Search</button>
      <button v-if="canWrite" class="fx-btn fx-btn--primary" :disabled="creating" @click="newConsol">
        {{ creating ? "Creating…" : "New import consol" }}
      </button>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Shipment</th>
          <th scope="col">Bill</th>
          <th scope="col">Client</th>
          <th scope="col">{{ mode === "air" ? "MAWB" : "BL no" }}</th>
          <th scope="col">{{ mode === "air" ? "Arrived" : "ETA" }}</th>
          <th scope="col">IGM</th>
          <th scope="col">Delivery order</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="j in jobs" :key="j.id" class="is-clickable" @click="$router.push('/import/' + j.id)">
          <td><router-link :to="'/import/' + j.id" class="identifier">{{ j.job_no }}</router-link></td>
          <td>{{ j.document === "master" ? "Consol" : "House" }}</td>
          <td>{{ j.client || "—" }}</td>
          <td class="identifier">{{ j.document_no || "—" }}</td>
          <td><Figure :value="j.arrival" kind="date" /></td>
          <td class="identifier">{{ j.igm_no || "—" }}</td>
          <td>
            <template v-if="j.do">
              <span class="identifier">{{ j.do.do_number }}</span>
              <StatusChip :value="j.do.status" />
            </template>
            <span v-else class="fx-muted">—</span>
          </td>
        </tr>
        <tr v-if="!jobs.length">
          <td colspan="7" class="fx-muted">No import shipments yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

/**
 * Import, both portals (GAPS #434). The server answers for the portal it is called from, so this one page is
 * FocusSea's import on focussea and FocusAir's on focusair.
 */
export default {
  name: "ImportList",
  components: { Figure, StatusChip },
  data: () => ({ mode: null, jobs: [], q: "", loading: false, creating: false, error: null }),
  computed: {
    ...mapGetters(["designation"]),
    canWrite() {
      return this.designation === "operations";
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get("/imports" + (this.q ? "?q=" + encodeURIComponent(this.q) : ""))
        .then(({ data }) => { this.mode = data.mode; this.jobs = data.jobs || []; this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    newConsol() {
      this.creating = true;
      // A sea import consol is a FocusSea master travelling the other way; air has its own create.
      const call = this.mode === "sea"
        ? ApiService.post("/sea-shipments", { direction: "import", cargo_type: "fcl" })
        : ApiService.post("/imports");
      call
        .then(({ data }) => this.$router.push("/import/" + data.job.id))
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.creating = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
