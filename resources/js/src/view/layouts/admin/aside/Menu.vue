<template>
  <!-- Five hubs instead of seventeen pages (owner, 2026-10-11); a hub's pages are the tabs across its top. -->
  <ul class="menu-nav">
    <li
      v-for="hub in hubs"
      :key="hub.key"
      aria-haspopup="true"
      class="menu-item"
      :class="{ 'menu-item-active': active && active.key === hub.key }"
    >
      <router-link :to="hub.to" class="menu-link">
        <i class="menu-icon" :class="hub.icon"></i>
        <span class="menu-text">{{ hub.label }}</span>
      </router-link>
    </li>

    <li class="menu-item">
      <a href="#" class="menu-link" @click.prevent="logout">
        <i class="menu-icon fas fa-sign-out-alt"></i>
        <span class="menu-text">Logout</span>
      </a>
    </li>
  </ul>
</template>

<script>
import { LOGOUT } from "@/core/services/store/auth.module";
import { ADMIN_HUBS, hubFor } from "@/core/config/adminHubs";

export default {
  name: "KTMenu",
  data: () => ({ hubs: ADMIN_HUBS }),
  computed: {
    active() {
      return hubFor(this.$route.path);
    },
  },
  methods: {
    logout() {
      this.$store.dispatch(LOGOUT).then(() => this.$router.push("/"));
    },
  },
};
</script>

<style scoped>
.menu-text {
  font-size: 14px !important;
}
a {
  color: #a2a3b7 !important;
}
.menu-item-active a {
  color: #fff !important;
}
</style>
