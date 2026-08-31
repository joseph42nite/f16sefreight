<template>
  <div class="fx-admin">
    <header class="fx-page-head">
      <h1 class="fx-page-title">Platform monitor</h1>
      <p class="fx-page-sub">
        Infrastructure health across the platform. F16s staff only — this is not a
        tenant view.
      </p>
    </header>

    <div class="fx-toolbar">
      <button class="fx-btn" :disabled="loading" @click="load">
        {{ loading ? "Checking…" : "Refresh" }}
      </button>
      <span v-if="checkedAt" class="fx-muted">
        Checked <Figure :value="checkedAt" kind="dateTime" />
      </span>
      <a class="fx-btn" :href="exportUrl" download>Export classification overrides</a>
    </div>

    <p v-if="error" class="fx-error" role="alert">{{ error }}</p>

    <!--
      🔴 A health endpoint that 500s tells you nothing. Each subsystem reports its own
      state, so a dead Redis is a red card next to a green database — not a blank page.
    -->
    <section class="fx-section">
      <div class="fx-tiles">
        <div v-for="s in subsystems" :key="s.key" class="fx-tile">
          <span class="fx-tile__label">{{ s.label }}</span>
          <span class="fx-tile__value">
            <!-- §1.3 the word carries the state; the colour only reinforces it. -->
            <StatusChip :value="s.status" />
          </span>
          <p v-if="s.detail" class="fx-muted fx-tile__detail">{{ s.detail }}</p>
        </div>
      </div>
    </section>

    <!--
      ⚠️ Queue depths PER QUEUE, never one total. `sync` at 400 with `ocr` at 2 is a
      different emergency from the reverse, and a combined number says neither.
    -->
    <section v-if="queues" class="fx-section">
      <h2 class="fx-section__title">Queue depth</h2>
      <table class="fx-table">
        <thead>
          <tr><th scope="col">Queue</th><th class="fx-num" scope="col">Pending</th></tr>
        </thead>
        <tbody>
          <tr v-for="(depth, name) in queues.depths" :key="name" :class="{ 'is-review': depth > 100 }">
            <td>{{ name }}</td>
            <td class="fx-num">{{ depth }}</td>
          </tr>
          <tr>
            <td><strong>Failed jobs</strong></td>
            <td class="fx-num" :class="{ 'fx-over': queues.failed > 0 }">{{ queues.failed }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="fx-section">
      <h2 class="fx-section__title">Log tail</h2>
      <button class="fx-btn" :disabled="logLoading" @click="loadLogs">
        {{ logLoading ? "Reading…" : "Read last 100 lines" }}
      </button>
      <p v-if="logPath" class="fx-muted fx-board__note">{{ logPath }} · {{ logSize }} MB</p>
      <!-- Read from the END of the file: a production log is routinely hundreds of MB. -->
      <pre v-if="logLines.length" class="fx-log">{{ logLines.join("\n") }}</pre>
      <p v-else-if="logPath" class="fx-muted">Nothing in the log yet.</p>
    </section>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";
import Figure from "@/view/pages/freight/components/Figure.vue";
import StatusChip from "@/view/pages/freight/components/StatusChip.vue";

export default {
  name: "SuperadminMonitor",
  components: { Figure, StatusChip },
  data: () => ({
    health: null, checkedAt: null, loading: false, error: null,
    logLines: [], logPath: null, logSize: null, logLoading: false,
  }),
  computed: {
    exportUrl() {
      return "/api/admin/classification-overrides/export";
    },
    queues() {
      const q = this.health && this.health.queues;
      return q && q.status === "up" ? q : null;
    },
    subsystems() {
      const h = this.health || {};
      const detail = (block) => {
        if (!block) return null;
        if (block.status === "down") return block.error || block.detail || "unreachable";
        if (block.latency_ms !== undefined) return block.latency_ms + " ms";
        if (block.load_1m !== undefined) return "load " + block.load_1m;
        return block.note || null;
      };

      return [
        { key: "database", label: "Database", status: (h.database || {}).status, detail: detail(h.database) },
        { key: "redis", label: "Redis", status: (h.redis || {}).status, detail: detail(h.redis) },
        { key: "queues", label: "Queues", status: (h.queues || {}).status, detail: detail(h.queues) },
        { key: "ai_server", label: "AI server", status: (h.ai_server || {}).status, detail: detail(h.ai_server) },
        { key: "host", label: "Host", status: (h.host || {}).status, detail: detail(h.host) },
      ];
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      ApiService.get("/admin/health")
        .then(({ data }) => { this.health = data; this.checkedAt = data.checked_at; this.error = null; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.loading = false; });
    },
    loadLogs() {
      this.logLoading = true;
      ApiService.get("/admin/logs")
        .then(({ data }) => { this.logLines = data.lines || []; this.logPath = data.path; this.logSize = data.size_mb; })
        .catch((e) => { this.error = this.readable(e); })
        .finally(() => { this.logLoading = false; });
    },
    readable(e) {
      const d = (e.response && e.response.data) || {};
      return d.error || d.message || "Something went wrong.";
    },
  },
};
</script>
