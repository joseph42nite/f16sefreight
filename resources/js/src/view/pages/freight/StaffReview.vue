<template>
  <!--
    A quarterly staff review in full — what the email's "See the details" opens (owner, 2026-10-05; GAPS #457).
    This quarter beside the last, who worked the account, every loss, cancellation and airline rejection with the
    person on it, and every job. For the people in the review's chain only; the server decides.
  -->
  <div class="fx-page">
    <p v-if="loading" class="fx-muted" role="status">Loading the review…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <template v-else>
      <h1 class="fx-page-title">Quarterly review · {{ f.client }}</h1>
      <p class="fx-muted">
        {{ f.mode === "sea" ? "⚓ Sea" : "✈ Air" }} · {{ f.quarter }}, with {{ f.previous_quarter }} beside each figure ·
        {{ review.status === "sent" ? "sent" : "not sent yet" }}
      </p>

      <section class="fx-section">
        <h2 class="fx-section__title">Who worked the account</h2>
        <p>Sales: {{ f.sales || "not set" }}</p>
        <p>Ops: {{ names(f.ops_staff) }}</p>
        <p>Pricing: {{ names(f.pricing_staff) }}</p>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">The quarter</h2>
        <table class="fx-table">
          <thead>
            <tr><th scope="col">Measure</th><th class="fx-num" scope="col">{{ f.quarter }}</th><th class="fx-num" scope="col">{{ f.previous_quarter }}</th></tr>
          </thead>
          <tbody>
            <tr><td>Enquiries</td><td class="fx-num">{{ f.enquiries.total }}</td><td class="fx-num">{{ f.previous_enquiries.total }}</td></tr>
            <tr><td>Converted</td><td class="fx-num">{{ f.enquiries.converted }}</td><td class="fx-num">{{ f.previous_enquiries.converted }}</td></tr>
            <tr><td>Lost</td><td class="fx-num">{{ f.enquiries.lost }}</td><td class="fx-num">{{ f.previous_enquiries.lost }}</td></tr>
            <tr><td>Shipments</td><td class="fx-num">{{ f.shipments }}</td><td class="fx-num">{{ f.previous_shipments }}</td></tr>
            <tr>
              <td title="Our own steps only — Intake to PDF Generated — against our normal">Days slower than our normal</td>
              <td class="fx-num">{{ fact(f.our_steps.days_slower) }}</td><td class="fx-num">{{ fact(f.our_steps.previous_days_slower) }}</td>
            </tr>
            <tr><td>Cancellation rate</td><td class="fx-num">{{ fact(f.rates.cancellation_rate, "%") }}</td><td class="fx-num">{{ fact(f.rates.previous_cancellation_rate, "%") }}</td></tr>
            <tr v-if="f.mode === 'air'">
              <td>Rejected by the airline (FNA)</td>
              <td class="fx-num">{{ fact(f.rates.fna_rate, "%") }}</td><td class="fx-num">{{ fact(f.rates.previous_fna_rate, "%") }}</td>
            </tr>
            <tr><td>Declared vs actual weight</td><td class="fx-num">{{ fact(f.rates.weight_gap_pct, "%") }}</td><td class="fx-num">{{ fact(f.rates.previous_weight_gap_pct, "%") }}</td></tr>
          </tbody>
        </table>
        <p v-if="slowSteps.length" class="fx-muted">Slower than normal at: {{ slowSteps.join(", ") }}.</p>
        <p class="fx-muted">"—" means too few jobs to measure, not zero.</p>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Enquiries lost ({{ f.lost.length }})</h2>
        <p v-if="!f.lost.length" class="fx-muted">None.</p>
        <table v-else class="fx-table">
          <thead><tr><th scope="col">Enquiry</th><th scope="col">Reason</th><th scope="col">Pricing</th></tr></thead>
          <tbody><tr v-for="r in f.lost" :key="r.enquiry"><td>{{ r.enquiry }}</td><td>{{ r.reason }}</td><td>{{ r.pricing || "not set" }}</td></tr></tbody>
        </table>
      </section>

      <section v-for="list in problemLists" :key="list.title" class="fx-section">
        <h2 class="fx-section__title">{{ list.title }} ({{ list.rows.length }})</h2>
        <p v-if="!list.rows.length" class="fx-muted">None.</p>
        <table v-else class="fx-table">
          <thead><tr><th scope="col">Job</th><th scope="col">AWB</th><th scope="col">Reason</th><th scope="col">Ops</th><th scope="col">Pricing</th></tr></thead>
          <tbody>
            <tr v-for="r in list.rows" :key="r.job">
              <td>{{ r.job }}</td><td>{{ r.awb || "—" }}</td><td>{{ r.reason }}</td><td>{{ r.ops || "not set" }}</td><td>{{ r.pricing || "not set" }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">All jobs in {{ f.quarter }} ({{ f.jobs.length }})</h2>
        <p v-if="!f.jobs.length" class="fx-muted">None.</p>
        <table v-else class="fx-table">
          <thead><tr><th scope="col">Job</th><th scope="col">AWB</th><th scope="col">Status</th><th scope="col">Ops</th><th scope="col">Pricing</th></tr></thead>
          <tbody>
            <tr v-for="r in f.jobs" :key="r.job">
              <td>{{ r.job }}</td><td>{{ r.awb || "—" }}</td><td>{{ r.status }}</td><td>{{ r.ops || "not set" }}</td><td>{{ r.pricing || "not set" }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

export default {
  name: "StaffReview",
  data: () => ({ review: null, loading: true, error: null }),
  computed: {
    f() {
      return (this.review && this.review.facts) || {};
    },
    slowSteps() {
      return Object.entries(this.f.our_steps.step_deltas || {}).filter(([, d]) => d > 0).sort((a, b) => b[1] - a[1])
        .map(([step, d]) => step + " +" + d + " days");
    },
    problemLists() {
      const lists = [{ title: "Jobs cancelled", rows: this.f.cancelled || [] }];
      if (this.f.mode === "air") lists.push({ title: "Rejected by the airline (FNA)", rows: this.f.rejected_by_airline || [] });
      return lists;
    },
  },
  created() {
    ApiService.get("/staff-reviews/" + this.$route.params.id)
      .then(({ data }) => { this.review = data; })
      .catch((err) => {
        const d = (err.response && err.response.data) || {};
        this.error = d.message || d.error || "This review could not be opened.";
      })
      .finally(() => { this.loading = false; });
  },
  methods: {
    names(list) {
      return list && list.length ? list.join(", ") : "nobody recorded";
    },
    fact(value, unit = "") {
      return value === null || value === undefined ? "—" : value + unit;
    },
  },
};
</script>
