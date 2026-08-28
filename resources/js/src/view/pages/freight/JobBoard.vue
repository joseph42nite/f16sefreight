<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Kanban</h1>
      <p class="fx-page-sub">
        Confirmed shipments on <strong>{{ portalLabel || 'all modes' }}</strong>.
      </p>
    </header>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <div v-else class="fx-board">
      <section v-for="col in columns" :key="col" class="fx-board__col">
        <h2 class="fx-board__head">
          {{ col }}
          <span class="fx-board__count">{{ grouped[col] ? grouped[col].length : 0 }}</span>
        </h2>

        <article v-for="job in grouped[col] || []" :key="job.id" class="fx-card">
          <div class="identifier fx-card__no">{{ job.execution_job_no || '—' }}</div>
          <div class="fx-card__meta">
            <span v-if="job.planned_clearance_date" class="numeric">
              clears <Figure :value="job.planned_clearance_date" kind="date" />
            </span>
            <span v-else class="is-empty" aria-label="No clearance date"></span>
          </div>
        </article>

        <p v-if="!(grouped[col] || []).length" class="fx-muted fx-board__empty">—</p>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "JobBoard",
  components: { Figure },
  data: () => ({ rows: [], loading: true, error: null }),
  computed: {
    ...mapGetters(["portalLabel"]),
    /* Mirrors App\Enums\JobStatus. 'Lost' is deliberately absent — it is an enquiry
       state, never a job one. */
    columns: () => [
      "Intake",
      "AI Extraction",
      "Verification",
      "Generation",
      "PDF Generated",
      "Sent to Airline",
      "Airline Confirmed",
      "Completed",
      "Cancelled",
    ],
    grouped() {
      return this.rows.reduce((acc, job) => {
        (acc[job.status] = acc[job.status] || []).push(job);
        return acc;
      }, {});
    },
  },
  created() {
    ApiService.get("/jobs")
      .then(({ data }) => {
        this.rows = data.data || [];
      })
      .catch((e) => {
        const d = (e.response && e.response.data) || {};
        this.error = d.error || d.message || "Something went wrong.";
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>
