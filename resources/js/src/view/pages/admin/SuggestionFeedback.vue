<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Suggestion feedback</h1>
      <p class="fx-page-sub">
        How sales reps answered the client emails the product suggested, across every customer, over the last
        {{ data ? data.days : 90 }} days — what they sent, what they dismissed and why. Use it to improve the suggestions.
      </p>
    </header>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>
    <p v-if="loading" class="fx-muted">Loading…</p>

    <template v-if="data">
      <section class="fx-section">
        <h2 class="fx-section__title">By suggestion</h2>
        <p v-if="!data.by_type.length" class="fx-muted">No suggestion has been sent or dismissed yet.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">Suggestion</th>
              <th class="fx-num" scope="col">Sent</th>
              <th class="fx-num" scope="col">Dismissed</th>
              <th class="fx-num" scope="col">Dismissed %</th>
              <th scope="col">Why dismissed</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in data.by_type" :key="t.type">
              <td>{{ label(t.type) }}</td>
              <td class="fx-num">{{ t.sent }}</td>
              <td class="fx-num">{{ t.dismissed }}</td>
              <td class="fx-num">{{ t.dismissed_percent === null ? "—" : t.dismissed_percent + "%" }}</td>
              <td>
                <span v-for="(n, reason) in data.reasons_by_type[t.type] || {}" :key="reason" class="fx-feedback__reason">
                  {{ data.reasons[reason] || reason }}: {{ n }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="fx-section">
        <h2 class="fx-section__title">Recent dismissals</h2>
        <p class="fx-muted">The figures each suggestion was built from. Client names are not shown.</p>
        <p v-if="!data.recent.length" class="fx-muted">None yet.</p>
        <table v-else class="fx-table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Customer</th>
              <th scope="col">Suggestion</th>
              <th scope="col">Figures</th>
              <th scope="col">Why</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in data.recent" :key="r.id">
              <td>{{ String(r.dismissed_at).slice(0, 10) }}</td>
              <td>{{ r.company }} <span class="fx-muted">· {{ r.tier }} · {{ r.mode }}</span></td>
              <td>{{ label(r.type) }}</td>
              <td class="fx-feedback__facts">
                <span v-for="(v, k) in r.facts" :key="k">{{ String(k).replace(/_/g, " ") }}: {{ Array.isArray(v) ? v.join(", ") : v }}</span>
              </td>
              <td>{{ data.reasons[r.reason] || r.reason }}<template v-if="r.note"> — {{ r.note }}</template></td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

/** The suggestion types, as the Sales page names them. */
const LABELS = {
  client_reactivation: "Stopped shipping",
  client_volume_drop: "Volume down",
  client_volume_growth: "Volume up",
  client_rate_review: "Lost on price",
  client_new_lanes: "New lanes to offer",
};

export default {
  name: "SuggestionFeedback",
  data: () => ({ data: null, loading: true, error: null }),
  created() {
    ApiService.get("/superadmin/suggestion-feedback")
      .then(({ data }) => { this.data = data; })
      .catch((e) => {
        const d = (e.response && e.response.data) || {};
        this.error = d.error || d.message || "Could not load the feedback.";
      })
      .finally(() => { this.loading = false; });
  },
  methods: {
    label(type) {
      return LABELS[type] || type;
    },
  },
};
</script>

<style scoped>
.fx-feedback__reason { display: inline-block; margin-right: var(--space-3); }
.fx-feedback__facts { font-size: .75rem; }
.fx-feedback__facts span { display: block; }
</style>
