<template>
  <div class="container-fluid py-4">
    <header class="mb-4">
      <h1 class="h4 mb-1">Domain directory</h1>
      <p class="text-muted mb-0">
        What the platform has learned about who owns which email domain. Approving an entry
        applies it to <strong>every tenant</strong> — so nothing here classifies anybody's
        mail until you say so.
      </p>
    </header>

    <!--
      🔴 The counts are the queue. A reviewer's first question is "is there anything
      waiting?", and making them read a table to find out is how a review screen stops
      being opened.
    -->
    <div class="btn-group mb-3" role="group" aria-label="Filter by status">
      <button
        v-for="s in STATUSES"
        :key="s.key"
        type="button"
        class="btn"
        :class="status === s.key ? 'btn-primary' : 'btn-outline-secondary'"
        @click="select(s.key)"
      >
        {{ s.label }}
        <span class="badge bg-light text-dark ml-1">{{ counts[s.key] || 0 }}</span>
      </button>
    </div>

    <button class="btn btn-outline-secondary btn-sm mb-3 ml-2" :disabled="promoting" @click="promote">
      {{ promoting ? "Checking…" : "Check for new agreement" }}
    </button>

    <p v-if="error" class="alert alert-danger">{{ error }}</p>
    <p v-if="loading" class="text-muted">Loading…</p>

    <p v-else-if="!rows.length" class="text-muted">
      <template v-if="status === 'proposed'">
        Nothing waiting. Domains appear here when a partner is added with an email address,
        or when several tenants correct the same domain the same way.
      </template>
      <template v-else>Nothing here.</template>
    </p>

    <table v-else class="table table-sm align-middle">
      <thead>
        <tr>
          <th scope="col">Domain</th>
          <th scope="col">Classify as</th>
          <th scope="col">Learned from</th>
          <th scope="col" class="text-right">Tenants</th>
          <th scope="col">Reviewed</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td class="font-weight-bold">{{ row.domain }}</td>

          <td>
            <!--
              🔴 The reviewer may CORRECT the classification while approving. A proposal is
              a guess from a partner row or a pile of corrections; the reviewer is the first
              person who actually knows. Forcing reject-and-retype would mean the right
              answer never gets recorded at all.
            -->
            <select
              v-if="row.status === 'proposed'"
              v-model="chosen[row.id]"
              class="form-control form-control-sm"
              style="width: auto; display: inline-block"
            >
              <option v-for="c in classifications" :key="c" :value="c">{{ label(c) }}</option>
            </select>
            <span v-else>{{ label(row.classification) }}</span>
          </td>

          <td>
            <span class="badge" :class="row.source === 'partner' ? 'badge-info' : 'badge-secondary'">
              {{ row.source === "partner" ? "a partner record" : "tenants agreeing" }}
            </span>
          </td>

          <!--
            ⚠️ The count is of distinct TENANTS, not corrections. One tenant correcting the
            same domain fifty times is one opinion repeated; three arriving independently is
            evidence, and only the second is a reason to apply it platform-wide.
          -->
          <td class="text-right">{{ row.confirmations }}</td>

          <td>
            <span v-if="row.reviewed_at" class="text-muted small">
              {{ row.reviewed_by_name || "—" }}<br />
              {{ stamp(row.reviewed_at) }}
              <em v-if="row.review_note" class="d-block">“{{ row.review_note }}”</em>
            </span>
            <span v-else class="text-muted">—</span>
          </td>

          <td class="text-right text-nowrap">
            <template v-if="row.status === 'proposed'">
              <button class="btn btn-sm btn-success" :disabled="busy === row.id" @click="approve(row)">
                Approve
              </button>
              <button class="btn btn-sm btn-outline-danger" :disabled="busy === row.id" @click="reject(row)">
                Reject
              </button>
            </template>
            <!--
              ⚠️ A rejected row stays listed rather than disappearing. A reviewer needs to
              see that a domain was already considered and refused — otherwise the same
              argument arrives again with no memory of the first answer.
            -->
            <span v-else-if="row.status === 'rejected'" class="text-muted small">refused</span>
            <span v-else class="text-success small">classifying</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

const STATUSES = [
  { key: "proposed", label: "Waiting" },
  { key: "approved", label: "Live" },
  { key: "rejected", label: "Refused" },
];

const LABELS = {
  customer_enquiry: "Customer enquiry",
  airline: "Airline",
  shipping_line: "Shipping line",
  clearance: "Clearance",
  trucking_road: "Trucking",
  other: "Other",
};

export default {
  name: "DomainDirectory",
  data: () => ({
    STATUSES,
    status: "proposed",
    rows: [], counts: {}, classifications: [],
    chosen: {},
    loading: true, promoting: false, busy: null, error: null,
  }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      this.error = null;

      ApiService.get("/superadmin/domain-directory?status=" + this.status)
        .then(({ data }) => {
          this.rows = data.rows || [];
          this.counts = data.counts || {};
          this.classifications = data.classifications || [];

          /* Pre-selected to what was proposed, so approving without touching the dropdown
             accepts the proposal as-is — the common case should take one click. */
          const chosen = {};
          this.rows.forEach((r) => { chosen[r.id] = r.classification; });
          this.chosen = chosen;
        })
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.loading = false; });
    },
    select(status) {
      this.status = status;
      this.load();
    },
    label(key) {
      return LABELS[key] || key;
    },
    approve(row) {
      this.busy = row.id;

      ApiService.post("/superadmin/domain-directory/" + row.id + "/approve", {
        classification: this.chosen[row.id],
      })
        .then(() => this.load())
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    reject(row) {
      /* 🔴 Confirmed, because a rejection is remembered. The row is kept as refused so the
         next partner added for that domain does not re-propose it — which means undoing it
         is not simply a matter of adding the partner again. */
      const note = window.prompt(
        "Refuse " + row.domain + "?\n\nThis is remembered — the domain will not be " +
        "proposed again. Add a note for whoever reads this later:",
        ""
      );

      if (note === null) return;

      this.busy = row.id;

      ApiService.post("/superadmin/domain-directory/" + row.id + "/reject", { note })
        .then(() => this.load())
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.busy = null; });
    },
    promote() {
      this.promoting = true;

      ApiService.post("/superadmin/domain-directory/promote")
        .then(() => this.load())
        .catch((e) => { this.error = this.messageFor(e); })
        .finally(() => { this.promoting = false; });
    },
    stamp(value) {
      const d = new Date(value);
      return isNaN(d) ? String(value)
        : d.toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric",
                                        hour: "2-digit", minute: "2-digit" });
    },
    messageFor(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
