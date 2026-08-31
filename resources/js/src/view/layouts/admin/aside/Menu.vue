<template>
  <ul class="menu-nav">
    <router-link
      to="/superadmin/monitor"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-heartbeat"></i>
          <span class="menu-text">Platform monitor</span>
        </a>
      </li>
    </router-link>

    <router-link
      to="/superadmin/support-desk"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-life-ring"></i>
          <span class="menu-text">Support desk</span>
        </a>
      </li>
    </router-link>

    <router-link
      to="/superadmin/all-company"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-building"></i>
          <span class="menu-text">Company</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/all-branch"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-map-marked-alt"></i>
          <span class="menu-text">Branch</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/all-users"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-users"></i>
          <span class="menu-text">Users</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/client-shipments"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-shipping-fast"></i>
          <span class="menu-text">Shipments</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/all-templates"
      v-slot="{ href, navigate, isActive, isExactActive }"
     >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-file-code"></i>
          <span class="menu-text">OCR Templates</span>
        </a>
      </li>
    </router-link>
    <router-link to="/superadmin/all-contacts" v-slot="{ href, navigate, isActive, isExactActive }">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-address-book"></i>
          <span class="menu-text">Contact</span>
        </a>
      </li>
    </router-link>
    <router-link to="/superadmin/setting" v-slot="{ href, navigate, isActive, isExactActive }">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-cog"></i>
          <span class="menu-text">Setting</span>
        </a>
      </li>
    </router-link>
    <router-link to="/superadmin/all-blogs" v-slot="{ href, navigate, isActive, isExactActive }">
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-blog"></i>
          <span class="menu-text">Manage Blogs</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/account"
      v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-user-circle"></i>
          <span class="menu-text">Account</span>
        </a>
      </li>
    </router-link>
    <router-link
      to=""
      @click.native="logout"
      v-slot="{ href, navigate, isActive, isExactActive }"
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active',
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <i class="menu-icon fas fa-sign-out-alt"></i>
          <span class="menu-text">Logout</span>
        </a>
      </li>
    </router-link>
  </ul>
</template>

<script>
import { LOGOUT } from "@/core/services/store/auth.module";
export default {
  name: "KTMenu",
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    },
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
</style>
