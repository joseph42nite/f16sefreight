<template>
  <div class="fx-bell">
    <button
      class="fx-bell__trigger"
      :aria-expanded="String(open)"
      :aria-label="unread ? unread + ' unread notifications' : 'Notifications'"
      @click="toggle"
    >
      🔔
      <!-- §5.6 the count, not just a dot — "3 waiting" and "1 waiting" are different
           days, and a bare dot makes them look the same. -->
      <span v-if="unread" class="fx-bell__dot">{{ unread > 9 ? "9+" : unread }}</span>
    </button>

    <div v-if="open" class="fx-bell__panel" role="dialog" aria-label="Notifications">
      <header class="fx-bell__head">
        <span>Notifications</span>
        <button class="fx-btn fx-btn--ghost" aria-label="Close" @click="open = false">✕</button>
      </header>

      <p v-if="loading" class="fx-muted fx-bell__pad">Loading…</p>
      <p v-else-if="!rows.length" class="fx-muted fx-bell__pad">Nothing waiting.</p>

      <div v-else class="fx-bell__list">
        <!-- ── Pinned: things waiting on a DECISION ───────────────────────── -->
        <template v-if="pinned.length">
          <p class="fx-bell__label">Pinned</p>
          <!--
            §5.6 auto-dissolve: a resolved row is REMOVED, and the transition-group
            makes the list reflow rather than blink. There is deliberately no
            "cancelled" tombstone — a bell is a list of things still needing a
            decision, and a resolved-but-visible row is one the owner re-makes every
            time they look.
          -->
          <transition-group name="fx-bell-row" tag="div">
            <article
              v-for="n in pinned"
              :key="n.id"
              class="fx-bell__row fx-bell__row--pinned"
              :class="{ 'is-unread': !n.read_at }"
            >
              <p class="fx-bell__text">
                Handover requested on
                <span class="identifier">{{ n.data.job_no || "a job" }}</span>
              </p>
              <p class="fx-bell__when"><Figure :value="n.created_at" kind="dateTime" /></p>

              <div v-if="canDecide" class="fx-bell__actions">
                <button class="fx-btn" :disabled="busy" @click="decide(n, 'accept')">Accept</button>
                <button class="fx-btn fx-btn--ghost" :disabled="busy" @click="decide(n, 'reject')">Reject</button>
              </div>
            </article>
          </transition-group>
        </template>

        <!-- ── Chronological, grouped by day ──────────────────────────────── -->
        <template v-for="group in chronological">
          <p v-if="group.rows.length" :key="group.label" class="fx-bell__label">{{ group.label }}</p>
          <article
            v-for="n in group.rows"
            :key="n.id"
            class="fx-bell__row"
            :class="{ 'is-unread': !n.read_at }"
            @click="markRead(n)"
          >
            <p class="fx-bell__text">{{ describe(n) }}</p>
            <p class="fx-bell__when"><Figure :value="n.created_at" kind="dateTime" /></p>
          </article>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";

export default {
  name: "BellPanel",
  components: { Figure },
  data: () => ({ rows: [], unread: 0, open: false, loading: false, busy: false }),
  computed: {
    ...mapGetters(["designation"]),
    /* Only the owner grants a handover — operations may ask. The buttons are HIDDEN
       for anyone else (§8.1 role forbids -> hide), not disabled. */
    canDecide() {
      return this.designation === "pricing" || this.designation === "boss";
    },
    pinned() {
      return this.rows.filter((n) => n.pinned);
    },
    /* Today / Yesterday / Earlier — §5.6. Grouping by day is what makes "is this new?"
       answerable at a glance without reading every timestamp. */
    chronological() {
      const rest = this.rows.filter((n) => !n.pinned);
      const day = (d) => new Date(d).toDateString();
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      return [
        { label: "Today", rows: rest.filter((n) => day(n.created_at) === today) },
        { label: "Yesterday", rows: rest.filter((n) => day(n.created_at) === yesterday) },
        { label: "Earlier", rows: rest.filter((n) => day(n.created_at) !== today && day(n.created_at) !== yesterday) },
      ];
    },
  },
  created() {
    this.load();
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open) this.load();
    },
    load() {
      this.loading = true;
      ApiService.get("/notifications")
        .then(({ data }) => {
          this.rows = data.notifications || [];
          this.unread = data.unread || 0;
        })
        /* A bell that errors must not take the header down with it. */
        .catch(() => {})
        .finally(() => { this.loading = false; });
    },
    describe(n) {
      if (n.type.indexOf("Reassignment") !== -1) {
        return "Handover requested on " + (n.data.job_no || "a job");
      }
      return n.type.split("\\").pop().replace(/([a-z])([A-Z])/g, "$1 $2");
    },
    markRead(n) {
      if (n.read_at) return;
      ApiService.post(`/notifications/${n.id}/read`, {})
        .then(({ data }) => { n.read_at = new Date().toISOString(); this.unread = data.unread; })
        .catch(() => {});
    },
    decide(n, decision) {
      this.busy = true;
      ApiService.post(`/jobs/${n.data.job_id}/reassign/resolve`, { decision })
        /* Reload rather than splice: the server decides what survives, and the row
           dissolving is the visible confirmation that it did. */
        .then(() => this.load())
        .catch(() => this.load())
        .finally(() => { this.busy = false; });
    },
  },
};
</script>
