<template>
  <!-- The open hub's pages, one tab each (owner, 2026-10-11: "so I don't have so many pages to open"). -->
  <nav v-if="hub" class="fx-hubtabs" :aria-label="hub.label">
    <router-link
      v-for="t in hub.tabs"
      :key="t.to"
      :to="t.to"
      class="fx-hubtabs__tab"
      :class="{ 'is-active': isActive(t) }"
      :aria-current="isActive(t) ? 'page' : null"
    >{{ t.label }}</router-link>
  </nav>
</template>

<script>
import { hubFor } from "@/core/config/adminHubs";

export default {
  name: "HubTabs",
  computed: {
    hub() {
      return hubFor(this.$route.path);
    },
  },
  methods: {
    isActive(tab) {
      const path = this.$route.path.replace(/\/+$/, "");
      return path === tab.to || path.startsWith(tab.to + "/");
    },
  },
};
</script>

<style scoped>
.fx-hubtabs { display: flex; flex-wrap: wrap; gap: 4px; margin: 16px 0 8px; border-bottom: 1px solid #e2e8f0; }
.fx-hubtabs__tab { padding: 8px 14px; font-size: .875rem; color: #475569; border-bottom: 2px solid transparent; margin-bottom: -1px; text-decoration: none; }
.fx-hubtabs__tab:hover { color: #1e293b; text-decoration: none; }
.fx-hubtabs__tab.is-active { color: #1e3a8a; font-weight: 600; border-bottom-color: #1e3a8a; }
</style>
