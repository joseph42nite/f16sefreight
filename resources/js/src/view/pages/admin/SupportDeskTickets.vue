<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Support desk</h1>
      <p class="fx-page-sub">
        Bug reports from every tenant. Captured deterministically by the in-app
        reporter — no model in the path, because a hallucinated selector sends a
        developer to the wrong screen with confident-looking evidence.
      </p>
    </header>

    <div class="fx-toolbar">
      <label class="fx-field">
        <span class="fx-field__label">Status</span>
        <select v-model="status" class="fx-input" @change="load">
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>
    </div>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-else-if="!tickets.length" class="fx-muted">Nothing in the queue.</p>

    <table v-else class="fx-table">
      <thead>
        <tr>
          <th scope="col">Reported</th>
          <th scope="col">Branch</th>
          <th scope="col">Reporter</th>
          <th scope="col">Route</th>
          <th scope="col">Description</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <!-- Oldest OPEN first: newest-first buries the report that has waited longest,
             which is the one most likely to be a customer about to give up. -->
        <tr v-for="t in tickets" :key="t.id">
          <td><Figure :value="t.created_at" kind="dateTime" /></td>
          <td>{{ t.branch ? t.branch.agent_name : "—" }}</td>
          <td>{{ t.reporter ? t.reporter.name : "—" }}<br />
            <span class="fx-muted">{{ t.reporter ? t.reporter.designation : "" }}</span>
          </td>
          <td class="identifier">{{ t.route }}</td>
          <td>
            {{ t.description }}
            <div v-if="t.element_selector" class="fx-muted identifier fx-ticket__selector">
              {{ t.element_selector }}
            </div>
          </td>
          <td><StatusChip :value="t.status" /></td>
          <td class="fx-row-actions">
            <!--
              ⚠️ FORWARD ONLY. A resolved ticket returning to open destroys the one
              queue metric that matters — how long a report waited before somebody
              looked — because its clock restarts. A returning bug is a new report.
            -->
            <button
              v-if="t.status === 'open'"
              class="fx-btn" :disabled="busy" @click="advance(t, 'investigating')"
            >Investigating</button>
            <button
              v-if="t.status === 'investigating'"
              class="fx-btn" :disabled="busy" @click="advance(t, 'resolved')"
            >Resolve</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "SupportDeskTickets",
  components: { Figure, StatusChip },
  data: () => ({ tickets: [], status: "", loading: true, busy: false, error: null }),
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get("/admin/tickets" + (this.status ? "?status=" + this.status : ""))
        .then(({ data }) => { this.tickets = data.data || []; this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    advance(ticket, status) {
      this.busy = true;
      ApiService.patch("/admin/tickets", ticket.id, { status })
        .then(() => this.load())
        /* §11.3 the server's reason verbatim — a backwards transition explains itself. */
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.busy = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
