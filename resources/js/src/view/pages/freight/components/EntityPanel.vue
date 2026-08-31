<template>
  <div>
    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <!--
        🔴 THE SAME ROLE MEANS A DIFFERENT COMPANY ON EACH DOCUMENT. Stated on screen,
        because it is the easiest thing here to get quietly wrong: a master bill naming
        the exporter as shipper names the wrong contracting party, and it reads
        perfectly well.
      -->
      <p class="fx-muted" style="margin-bottom: var(--space-3)">
        This is
        <strong>{{ document === "master" ? "a master bill" : "a house bill" }}</strong>.
        <template v-if="document === 'master'">
          The shipper is the forwarder branch itself and the consignee is the destination agent —
          not the exporter and buyer.
        </template>
        <template v-else>
          The shipper is the actual exporter and the consignee is the overseas buyer.
        </template>
      </p>

      <table class="fx-table">
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">Party</th>
            <th scope="col">Type</th>
            <th v-if="canWrite" scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in entities" :key="e.id">
            <td>{{ e.label }}</td>
            <td>{{ e.name || "—" }}</td>
            <td class="fx-muted">{{ e.party_type }}</td>
            <td v-if="canWrite" class="fx-row-actions">
              <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="remove(e)">✕</button>
            </td>
          </tr>
          <tr v-if="!entities.length">
            <td :colspan="canWrite ? 4 : 3" class="fx-muted">No parties yet.</td>
          </tr>
        </tbody>
      </table>

      <div v-if="canWrite" class="fx-toolbar" style="margin-top: var(--space-4)">
        <label class="fx-field">
          <span class="fx-field__label">Role</span>
          <select v-model="draft.role" class="fx-input" @change="onRole">
            <option v-for="r in roles" :key="r" :value="r">{{ r.replace(/_/g, " ") }}</option>
          </select>
        </label>

        <!--
          The party type is DERIVED for the three mapped roles, so the operator cannot
          pick the wrong one. The server refuses a mismatch anyway; this stops them
          reaching a refusal at all.
        -->
        <div v-if="expected[draft.role]" class="fx-field">
          <span class="fx-field__label">Party type</span>
          <span class="fx-input fx-input--static">{{ expected[draft.role].party_type }}</span>
          <span class="fx-field__hint">{{ expected[draft.role].description }}</span>
        </div>
        <label v-else class="fx-field">
          <span class="fx-field__label">Party type</span>
          <select v-model="draft.party_type" class="fx-input" @change="draft.party_id = ''">
            <option value="customer">customer</option>
            <option value="partner">partner</option>
          </select>
        </label>

        <label class="fx-field">
          <span class="fx-field__label">Party</span>
          <select v-model="draft.party_id" class="fx-input">
            <option value="">Choose…</option>
            <option v-for="p in options" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </label>

        <label v-if="draft.role === 'other'" class="fx-field">
          <span class="fx-field__label">Label</span>
          <input v-model="draft.custom_role_label" class="fx-input" type="text" maxlength="50" />
        </label>

        <button class="fx-btn" :disabled="!draft.party_id || busy" @click="add">Add party</button>
      </div>

      <p v-if="actionError" class="fx-error" role="alert">{{ actionError }}</p>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";

export default {
  name: "EntityPanel",
  props: { jobId: { type: [Number, String], required: true } },
  data: () => ({
    entities: [], roles: [], expected: {}, document: "house",
    customers: [], partners: [],
    draft: { role: "shipper", party_type: "customer", party_id: "", custom_role_label: "" },
    loading: true, busy: false, error: null, actionError: null,
  }),
  computed: {
    ...mapGetters(["designation"]),
    canWrite() {
      return this.designation === "operations";
    },
    /* The mapped roles fix the party type; the rest let the operator choose. */
    partyType() {
      const e = this.expected[this.draft.role];
      return e ? e.party_type : this.draft.party_type;
    },
    options() {
      return this.partyType === "customer" ? this.customers : this.partners;
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
      ApiService.get(`/jobs/${this.jobId}/entities`)
        .then(({ data }) => {
          this.entities = data.entities || [];
          this.roles = data.roles || [];
          this.expected = data.expected || {};
          this.document = data.document;
          this.error = null;
        })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    onRole() {
      this.draft.party_id = "";
    },
    add() {
      this.busy = true;
      this.actionError = null;
      ApiService.post(`/jobs/${this.jobId}/entities`, {
        role: this.draft.role,
        party_type: this.partyType,
        party_id: this.draft.party_id,
        custom_role_label: this.draft.custom_role_label || null,
      })
        .then(({ data }) => {
          this.entities = data.entities;
          this.draft.party_id = "";
          this.draft.custom_role_label = "";
        })
        /* §11.3 — "On a master bill, the shipper is the forwarder branch itself, not a
           customer" is the whole explanation. A generic failure would leave the
           operator guessing which of three fields was wrong. */
        .catch((e) => { this.actionError = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    remove(entity) {
      this.busy = true;
      ApiService.delete(`/jobs/${this.jobId}/entities/${entity.id}`)
        .then(({ data }) => { this.entities = data.entities; })
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
