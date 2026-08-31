<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">FocusSea — Consolidation</h1>
      <p class="fx-page-sub">Link house bills to a master and allocate their cargo into containers.</p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Master</span>
        <select v-model="masterId" class="fx-input" @change="load">
          <option value="">Choose…</option>
          <option v-for="m in masters" :key="m.id" :value="m.id">
            {{ m.execution_job_no || ("Job " + m.id) }}
          </option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else-if="consol">
      <!--
        🔴 The reconciliation IcegateValidator enforces at FILING, surfaced while the
        consol is still being built. "47 against 48" discovered at submission is a
        burned filing; discovered here it is one number to fix.
      -->
      <p v-if="!consol.reconciliation.balanced && consol.houses.length" class="fx-warn" role="status">
        Houses declare {{ consol.reconciliation.house_pieces }} pieces against a master of
        {{ consol.reconciliation.master_pieces }}. Customs refuses a manifest where these differ.
      </p>
      <p v-else-if="consol.reconciliation.unstuffed > 0" class="fx-warn" role="status">
        {{ consol.reconciliation.unstuffed }} piece(s) are not yet allocated to a container.
      </p>

      <!-- ── Linked houses ────────────────────────────────────────────────── -->
      <section class="fx-section">
        <h2 class="fx-section__title">House bills ({{ consol.houses.length }})</h2>
        <table class="fx-table">
          <thead>
            <tr>
              <th scope="col">Job</th>
              <th scope="col">HBL</th>
              <th scope="col">Customer</th>
              <th class="fx-num" scope="col">Pieces</th>
              <th class="fx-num" scope="col">Weight</th>
              <th class="fx-num" scope="col">Volume</th>
              <th v-if="canWrite" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in consol.houses" :key="h.id">
              <td class="identifier">{{ h.execution_job_no || h.id }}</td>
              <td class="identifier">
                <span v-if="h.hbl_number">{{ h.hbl_number }}</span>
                <span v-else class="is-empty" aria-label="No HBL number"></span>
              </td>
              <td>{{ h.customer || "—" }}</td>
              <td class="fx-num"><Figure :value="h.piece_count" kind="count" /></td>
              <td class="fx-num"><Figure :value="h.gross_weight" kind="weight" /></td>
              <td class="fx-num"><Figure :value="h.volume_cbm" kind="volume" /></td>
              <td v-if="canWrite" class="fx-row-actions">
                <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="unlink(h)">Unlink</button>
              </td>
            </tr>
            <tr v-if="!consol.houses.length">
              <td :colspan="canWrite ? 7 : 6" class="fx-muted">No houses linked yet.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- ── Association panel ────────────────────────────────────────────── -->
      <section v-if="canWrite" class="fx-section">
        <h2 class="fx-section__title">Link a house</h2>
        <div class="fx-toolbar">
          <label class="fx-field">
            <span class="fx-field__label">Unassociated shipments</span>
            <select v-model="linkId" class="fx-input">
              <option value="">Choose…</option>
              <option v-for="j in candidates" :key="j.id" :value="j.id">
                {{ j.execution_job_no || ("Job " + j.id) }}
              </option>
            </select>
          </label>
          <button class="fx-btn" :disabled="!linkId || busy" @click="link">Link HBL</button>
        </div>
        <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
      </section>

      <!-- ── Container stuffing matrix ────────────────────────────────────── -->
      <section class="fx-section">
        <h2 class="fx-section__title">Container stuffing</h2>

        <p v-if="!consol.containers.length" class="fx-muted">
          No containers on this master yet. Add them on the FocusSea document, Container tab.
        </p>

        <table v-else class="fx-table fx-matrix">
          <thead>
            <tr>
              <th scope="col">House</th>
              <th v-for="c in consol.containers" :key="c.id" class="fx-num" scope="col">
                <span class="identifier">{{ c.container_number }}</span>
              </th>
              <th class="fx-num" scope="col">Allocated / declared</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="h in consol.houses" :key="h.id">
              <th scope="row" class="identifier">{{ h.execution_job_no || h.id }}</th>
              <td v-for="c in consol.containers" :key="c.id" class="fx-num">
                <input
                  class="fx-input fx-input--cell"
                  type="number"
                  min="0"
                  :disabled="!canWrite || busy"
                  :value="stuffed(c.id, h.id)"
                  @change="(e) => stuff(c.id, h.id, e.target.value)"
                />
              </td>
              <!--
                ⚠️ Over-allocation is refused SERVER-side; this column is how the
                operator sees it coming. Stuffing more than a house declares means the
                manifest claims cargo that does not exist.
              -->
              <td class="fx-num" :class="{ 'fx-over': allocated(h.id) > h.piece_count }">
                {{ allocated(h.id) }} / {{ h.piece_count }}
              </td>
            </tr>
            <tr v-if="!consol.houses.length">
              <td :colspan="consol.containers.length + 2" class="fx-muted">Link a house first.</td>
            </tr>
          </tbody>
        </table>

        <!--
          ❓ Pieces only. PRD §5.8 describes allocating pieces/weight/volume, but
          `sea_container_items` carries only piece_count — GAPS #32.
        -->
        <p class="fx-muted fx-board__note">
          Pieces only — the stuffing table has no weight or volume columns (GAPS #32).
        </p>
      </section>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "FocusSeaConsol",
  components: { Figure },
  data: () => ({
    masters: [], candidates: [], consol: null,
    masterId: "", linkId: "",
    loading: false, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    canWrite() {
      return this.designation === "operations";
    },
  },
  created() {
    ApiService.get("/jobs?transport_mode=sea")
      .then(({ data }) => { this.masters = (data.data || []).filter((j) => j.transport_mode === "sea"); })
      .catch((e) => { this.error = this.readable(e); });
  },
  methods: {
    load() {
      if (!this.masterId) return;
      this.loading = true;

      Promise.all([
        ApiService.get(`/jobs/${this.masterId}/consol`),
        ApiService.get("/jobs/unassociated?transport_mode=sea"),
      ])
        .then(([consol, free]) => {
          this.consol = consol.data;
          /* A master cannot be its own house — filtered here as well as refused
             server-side, so the picker never offers an impossible link. */
          this.candidates = (free.data.data || []).filter((j) => String(j.id) !== String(this.masterId));
          this.error = null;
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    stuffed(containerId, houseId) {
      const row = this.consol.stuffing.find((s) => s.container_id === containerId && s.job_id === houseId);
      return row ? row.piece_count : 0;
    },
    allocated(houseId) {
      return this.consol.stuffing
        .filter((s) => s.job_id === houseId)
        .reduce((n, s) => n + Number(s.piece_count), 0);
    },
    link() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/jobs/${this.masterId}/link-hbl`, { house_id: this.linkId })
        .then(({ data }) => { this.consol = data; this.linkId = ""; this.load(); })
        /* §11.3 the server's reason verbatim — "already belongs to another consol"
           tells the operator where to go; "link failed" does not. */
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    unlink(house) {
      this.busy = true;
      ApiService.delete(`/jobs/${this.masterId}/link-hbl/${house.id}`)
        .then(({ data }) => { this.consol = data; this.load(); })
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    stuff(containerId, houseId, value) {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/jobs/${this.masterId}/stuff`, {
        container_id: containerId, house_id: houseId, piece_count: Number(value) || 0,
      })
        .then(({ data }) => { this.consol = data; })
        .catch((e) => { this.actionError = this.readable(e); this.load(); })
        .finally(() => { this.busy = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
