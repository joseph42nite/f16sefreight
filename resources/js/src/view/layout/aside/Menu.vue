<template>
  <ul class="menu-nav">
    <router-link
      to="/account"
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
import { mapGetters } from "vuex";
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
  computed: {
    ...mapGetters(["currentUser"]),
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
