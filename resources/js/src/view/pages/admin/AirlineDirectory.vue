<template>
  <div class="container-fluid py-4">
    <header class="mb-3">
      <h1 class="h4 mb-1">Airlines</h1>
      <p class="text-muted mb-0">
        Prefix, name and email domain, curated here for every tenant. An operator picks a
        carrier from this list instead of typing a prefix from memory — and the domain is
        what classifies that airline's mail across the platform.
      </p>
    </header>

    <div class="d-flex align-items-center mb-3" style="gap:.5rem">
      <input v-model="q" class="form-control" style="max-width:20rem"
             placeholder="Name, prefix, code or domain" @keyup.enter="load" />
      <button class="btn btn-outline-secondary" @click="load">Search</button>
      <button class="btn btn-primary ml-auto" @click="startNew">Add airline</button>
    </div>

    <p v-if="error" class="alert alert-danger">{{ error }}</p>

    <!-- Add / edit, inline: the list is the context and a modal would hide it. -->
    <div v-if="editing" class="card mb-3">
      <div class="card-body">
        <div class="form-row">
          <div class="col-md-2 mb-2">
            <label class="small text-muted mb-1">Prefix</label>
            <input v-model="form.prefix" class="form-control" maxlength="3" placeholder="176" />
          </div>
          <div class="col-md-2 mb-2">
            <label class="small text-muted mb-1">Code</label>
            <input v-model="form.code" class="form-control" maxlength="5" placeholder="EK" />
          </div>
          <div class="col-md-4 mb-2">
            <label class="small text-muted mb-1">Name</label>
            <input v-model="form.name" class="form-control" placeholder="Emirates SkyCargo" />
          </div>
          <div class="col-md-4 mb-2">
            <label class="small text-muted mb-1">Email domain</label>
            <!--
              🔐 A DOMAIN, not an address. `ops@lhcargo.test` would classify one mailbox;
              `lhcargo.test` classifies the carrier.
            -->
            <input v-model="form.domain" class="form-control" placeholder="lhcargo.test" />
          </div>
        </div>

        <div class="form-row">
          <div class="col-md-3 mb-2">
            <label class="small text-muted mb-1">Country</label>
            <input v-model="form.country" class="form-control" />
          </div>
          <div class="col-md-9 mb-2">
            <label class="small text-muted mb-1">Address (printed on the waybill)</label>
            <input v-model="form.airline_address" class="form-control" />
          </div>
        </div>

        <button class="btn btn-primary" :disabled="saving" @click="save">
          {{ saving ? "Saving…" : "Save" }}
        </button>
        <button class="btn btn-link" @click="editing = null">Cancel</button>
      </div>
    </div>

    <p v-if="loading" class="text-muted">Loading…</p>

    <p v-else-if="!rows.length" class="text-muted">
      No airlines yet. Add the carriers you deal with — prefix and name are enough to start;
      the domain can follow.
    </p>

    <table v-else class="table table-sm align-middle">
      <thead>
        <tr>
          <th scope="col">Prefix</th>
          <th scope="col">Code</th>
          <th scope="col">Name</th>
          <th scope="col">Email domain</th>
          <th scope="col">Country</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="font-weight-bold">{{ row.prefix }}</td>
          <td>{{ row.code || "—" }}</td>
          <td>{{ row.name }}</td>
          <td>
            <span v-if="row.domain">{{ row.domain }}</span>
            <!-- ⚠️ Named, not blank: a carrier with no domain classifies nothing, and the
                 reader should know that is why. -->
            <span v-else class="text-muted small">no domain — classifies nothing</span>
          </td>
          <td>{{ row.country || "—" }}</td>
          <td class="text-right">
            <button class="btn btn-sm btn-outline-secondary" @click="startEdit(row)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

const EMPTY = { name: "", prefix: "", code: "", country: "", domain: "", airline_address: "", is_active: true };

export default {
  name: "AirlineDirectory",
  data: () => ({
    rows: [], q: "", loading: true, saving: false, error: null,
    editing: null, form: { ...EMPTY },
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      this.error = null;

      ApiService.get("/superadmin/airlines?q=" + encodeURIComponent(this.q))
        .then(({ data }) => { this.rows = data.data || []; })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    startNew() {
      this.editing = "new";
      this.form = { ...EMPTY };
    },
    startEdit(row) {
      this.editing = row.id;
      this.form = { ...EMPTY, ...row };
    },
    save() {
      this.saving = true;
      this.error = null;

      const isNew = this.editing === "new";
      const call = isNew
        ? ApiService.post("/superadmin/airlines", this.form)
        : ApiService.put("/superadmin/airlines/" + this.editing, this.form);

      call
        .then(() => { this.editing = null; this.load(); })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.saving = false; });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      if (d.errors) return Object.values(d.errors).flat().join(" ");
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
