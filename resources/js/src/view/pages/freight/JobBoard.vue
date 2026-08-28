<template>
  <div>
    <header class="fx-page-head">
      <h1 class="fx-page-title">Kanban</h1>
      <p class="fx-page-sub">
        Confirmed shipments on <strong>{{ portalLabel || 'all modes' }}</strong>.
        Drag a card to move it through the lifecycle.
      </p>
    </header>

    <p v-if="loading" class="fx-muted">Loading…</p>
    <p v-else-if="error" class="fx-error" role="alert">{{ error }}</p>

    <div v-else class="fx-board">
      <section v-for="col in columns" :key="col" class="fx-board__col">
        <h2 class="fx-board__head">
          {{ col }}
          <span class="fx-board__count">{{ (grouped[col] || []).length }}</span>
        </h2>

        <!--
          §8.1 STATE FORBIDS -> DISABLED WITH A REASON. Cancelled is a terminal state
          reached only through POST /jobs/{id}/cancel, which requires a reason and
          refuses when posted invoices exist. Dropping a card into it would bypass both,
          so the column takes no drops and says why.
        -->
        <draggable
          :list="grouped[col] || []"
          :group="{ name: 'jobs', pull: !isTerminal(col), put: !isTerminal(col) }"
          class="fx-board__drop"
          ghost-class="fx-card--ghost"
          :disabled="!canMove"
          @change="(e) => onChange(e, col)"
        >
          <article v-for="job in grouped[col] || []" :key="job.id" class="fx-card">
            <div class="identifier fx-card__no">{{ job.execution_job_no || '—' }}</div>
            <div class="fx-card__meta">
              <span v-if="job.planned_clearance_date">
                clears <Figure :value="job.planned_clearance_date" kind="date" />
              </span>
              <span v-else class="is-empty" aria-label="No clearance date"></span>
            </div>
          </article>
        </draggable>

        <p v-if="!(grouped[col] || []).length" class="fx-muted fx-board__empty">—</p>
        <p v-if="isTerminal(col)" class="fx-board__note">
          Set from the job, not by dragging
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import draggable from "vuedraggable";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

/* Mirrors App\Enums\JobStatus exactly. 'Lost' is deliberately absent — it is an
   enquiry state, never a job one, and the database CHECK refuses it here. */
const COLUMNS = [
  "Intake",
  "AI Extraction",
  "Verification",
  "Generation",
  "PDF Generated",
  "Sent to Airline",
  "Airline Confirmed",
  "Completed",
];

/* Cancelled is reachable only through the cancel endpoint, which demands a reason and
   refuses when financial documents are posted. It is shown so the board is complete,
   but it accepts no drops. */
const TERMINAL = ["Cancelled"];

export default {
  name: "JobBoard",
  components: { draggable, Figure },
  data: () => ({ rows: [], loading: true, error: null }),
  computed: {
    ...mapGetters(["portalLabel", "can"]),
    columns: () => COLUMNS.concat(TERMINAL),
    canMove() {
      // Both roles that work the board may move a card. Re-checked server-side.
      return this.can(["pricing", "operations"], "tactical");
    },
    grouped() {
      const out = {};
      this.columns.forEach((c) => {
        out[c] = [];
      });
      this.rows.forEach((job) => {
        (out[job.status] = out[job.status] || []).push(job);
      });
      return out;
    },
  },
  created() {
    this.load();
  },
  methods: {
    isTerminal: (col) => TERMINAL.indexOf(col) !== -1,

    load() {
      this.loading = true;
      ApiService.get("/jobs")
        .then(({ data }) => {
          this.rows = data.data || [];
        })
        .catch((e) => {
          this.error = this.readable(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * A card landed in a new column.
     *
     * The server is the authority: on any failure the board reloads rather than trying
     * to reverse the move locally. An optimistic UI that guesses wrong leaves the
     * operator looking at a status the shipment does not have.
     */
    onChange(event, column) {
      if (!event.added) return;

      const job = event.added.element;
      const previous = job.status;

      ApiService.put(`/jobs/${job.id}/status`, { status: column })
        .then(({ data }) => {
          job.status = data.status;
          this.error = null;
        })
        .catch((e) => {
          job.status = previous;
          this.error = this.readable(e);
          this.load(); // resync from the source of truth
        });
    },

    /* §11.3 — surface the server's reason. The API returns a `reason` code precisely
       so the UI can be specific rather than saying "something went wrong". */
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
