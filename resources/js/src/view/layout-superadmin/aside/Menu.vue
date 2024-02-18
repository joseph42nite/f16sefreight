<template>
  <ul class="menu-nav">
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
          <img
            src="/media/custome/menu-icons/customer.svg"
            alt="branch users icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Users</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/rate-import"
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
          <img
            src="/media/custome/menu-icons/list.svg"
            alt="branch users icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Import Rate</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/location-import"
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
          <img
            src="/media/custome/menu-icons/list.svg"
            alt="branch users icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Import Location</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/ams-import"
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
          <img
            src="/media/custome/menu-icons/list.svg"
            alt="branch users icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Import Ams</span>
        </a>
      </li>
    </router-link>
    <router-link to="/superadmin/delete-rate" v-slot="{ href, navigate, isActive, isExactActive }">
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
          <img src="/media/custome/menu-icons/list.svg" alt="branch users icon" class="img-fluid" width="18" height="18"/>
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Delete Rate</span>
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
          <img src="/media/custome/menu-icons/list.svg" alt="branch users icon" class="img-fluid" width="18" height="18"/>
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Setting</span>
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
          <img
            src="/media/custome/menu-icons/user.svg"
            alt="account icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
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
          <img
            src="/media/custome/menu-icons/logout.svg"
            alt="logout icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
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
      this.$store.dispatch(LOGOUT).then(() => this.$router.push("/login"));
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
