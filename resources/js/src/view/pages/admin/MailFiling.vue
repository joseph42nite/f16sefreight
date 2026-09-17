<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Mail filing</h1>
      <p class="fx-page-sub">
        How the regex files incoming mail, and how often people change it — so the patterns can be improved. Counts
        conversations started in the period.
      </p>
    </header>

    <div class="fx-toolbar fx-filing__filters">
      <label class="fx-field" for="filing-company">
        <span class="fx-field__label">Company</span>
        <select id="filing-company" v-model="companyId" class="fx-input" @change="load">
          <option :value="null">All companies</option>
          <option v-for="c in companies" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </label>
      <label class="fx-field" for="filing-days">
        <span class="fx-field__label">Period</span>
        <select id="filing-days" v-model.number="days" class="fx-input" @change="load">
          <option v-for="d in periods" :key="d" :value="d">Last {{ d }} days</option>
        </select>
      </label>
      <button class="fx-btn" :disabled="exporting" @click="exportCsv">
        {{ exporting ? "Exporting…" : "Export changes (CSV)" }}
      </button>
    </div>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="fx-muted">Loading…</p>

    <template v-if="data">
      <section class="fx-section">
        <h2 class="fx-section__title">What the regex filed</h2>
        <p v-if="!data.by_type.length" class="fx-muted">No mail filed in this period.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">Filed as</th>
              <th class="fx-num" scope="col">Mails</th>
              <th class="fx-num" scope="col">Changed by a person</th>
              <th class="fx-num" scope="col">Changed %</th>
              <th scope="col">Changed to</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in data.by_type" :key="t.filed_as">
              <td>{{ label(t.filed_as) }}</td>
              <td class="fx-num">{{ t.filed }}</td>
              <td class="fx-num">{{ t.changed }}</td>
              <td class="fx-num" :class="{ 'fx-filing__high': t.changed_percent >= 20 }">{{ t.changed_percent }}%</td>
              <td>
                <span v-for="(n, to) in t.changed_to" :key="to" class="fx-feedback__reason">{{ label(to) }}: {{ n }}</span>
                <span v-if="!t.changed" class="fx-muted">—</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="fx-muted">
          <strong>Missed enquiries:</strong> {{ data.missed_enquiries }} — filed as something else, changed to customer
          enquiry by a person.
        </p>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Senders changed most often</h2>
        <p class="fx-muted">A sender domain that keeps being changed the same way is a rule waiting to be written.</p>
        <p v-if="!data.domains.length" class="fx-muted">No changes in this period.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">Sender domain</th>
              <th scope="col">From → to</th>
              <th class="fx-num" scope="col">Times</th>
              <th scope="col">Example subject</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(d, i) in data.domains" :key="i">
              <td>{{ d.sender_domain || "—" }}</td>
              <td>{{ label(d.was) }} → {{ label(d.now) }}</td>
              <td class="fx-num">{{ d.n }}</td>
              <td>{{ d.example }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Recent changes</h2>
        <p class="fx-muted">The words the regex read, so the pattern that should have matched can be seen.</p>
        <p v-if="!data.recent.length" class="fx-muted">No changes in this period.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Company</th>
              <th scope="col">From → to</th>
              <th scope="col">Sender</th>
              <th scope="col">Subject and text</th>
              <th scope="col">By</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in data.recent" :key="r.id">
              <td>{{ String(r.created_at).slice(0, 16) }}</td>
              <td>{{ r.company }}</td>
              <td>{{ label(r.was) }} → {{ label(r.now) }}</td>
              <td>{{ r.sender_email }}</td>
              <td class="fx-filing__text"><strong>{{ r.subject }}</strong><br />{{ r.snippet }}</td>
              <td>{{ r.by }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

/** Super admin: how the regex files mail and how often people change it (user, 2026-09-17). */
export default {
  name: "MailFiling",
  data: () => ({ data: null, companies: [], periods: [7, 30, 90], companyId: null, days: 30, loading: false, error: null, exporting: false }),
  created() { this.load(); },
  methods: {
    params() {
      return { days: this.days, ...(this.companyId ? { company_id: this.companyId } : {}) };
    },
    load() {
      this.loading = true;
      this.error = null;
      ApiService.query("/admin/mail-filing", { params: this.params() })
        .then(({ data }) => { this.data = data; this.companies = data.companies; this.periods = data.periods; })
        .catch(() => { this.error = "Could not load the mail filing figures."; })
        .finally(() => { this.loading = false; });
    },
    /** Downloaded through the signed-in request — a plain link carries no sign-in and is refused. */
    exportCsv() {
      this.exporting = true;
      ApiService.query("/admin/classification-overrides/export", { params: this.params(), responseType: "blob" })
        .then(({ data }) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(data);
          link.download = "mail-filing-changes.csv";
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch(() => { this.error = "Could not export the changes."; })
        .finally(() => { this.exporting = false; });
    },
    label(value) {
      return value ? value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ") : "—";
    },
  },
};
</script>
