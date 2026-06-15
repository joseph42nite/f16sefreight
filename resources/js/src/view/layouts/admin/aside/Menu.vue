<template>
  <ul class="menu-nav">
    <router-link
      to="/superadmin/boss-dashboard"
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
            src="/media/assets/ui/menu-icons/list.svg"
            alt="boss-dashboard"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Boss Dashboard</span>
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
          <img
            src="/media/assets/ui/menu-icons/customer.svg"
            alt="company"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
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
          <img
            src="/media/assets/ui/menu-icons/customer.svg"
            alt="branch"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
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
          <img
            src="/media/assets/ui/menu-icons/customer.svg"
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
          <img
            src="/media/assets/ui/menu-icons/customer.svg"
            alt="template icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
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
          <img src="/media/assets/ui/menu-icons/customer.svg" alt="Contact users icon" class="img-fluid" width="18" height="18"/>
          &nbsp;&nbsp;&nbsp;
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
          <img src="/media/assets/ui/menu-icons/list.svg" alt="branch users icon" class="img-fluid" width="18" height="18"/>
          &nbsp;&nbsp;&nbsp;
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
          <img src="/media/assets/ui/menu-icons/list.svg" alt="Manage Blogs icon" class="img-fluid" width="18" height="18"/>
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">Manage Blogs</span>
        </a>
      </li>
    </router-link>
    <router-link
      to="/superadmin/client-awb-tracking"
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
            src="/media/assets/ui/menu-icons/list.svg"
            alt="AWB tracking icon"
            class="img-fluid"
            width="18"
            height="18"
          />
          &nbsp;&nbsp;&nbsp;
          <span class="menu-text">AWB Tracking</span>
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
            src="/media/assets/ui/menu-icons/user.svg"
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
            src="/media/assets/ui/menu-icons/logout.svg"
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
