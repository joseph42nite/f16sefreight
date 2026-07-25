<template>
  <!-- begin:: Aside -->
  <div>
  <div class="brand flex-column-auto d-flex align-items-center justify-content-between" id="kt_brand" ref="kt_brand">
    <!-- Logo (hidden on phone — the mobile header already shows it) -->
    <router-link to="/superadmin/all-company" class="brand-logo d-none d-lg-flex align-items-center">
      <img src="/media/assets/logos/white-logo.png" alt="F16s" class="brand-logo-img" />
    </router-link>

    <div class="d-flex align-items-center ml-auto">
      <!-- Desktop minimize toggle -->
      <div class="brand-tools" v-if="allowMinimize">
        <button
          class="brand-toggle btn btn-sm px-0"
          id="kt_aside_toggle"
          ref="kt_aside_toggle"
        >
          <span class="svg-icon svg-icon svg-icon-xl">
            <inline-svg
              class="svg-icon"
              src="media/svg/icons/Navigation/Angle-double-left.svg"
            />
          </span>
        </button>
      </div>

      <!-- Mobile close button (wired to the offcanvas via id) -->
      <button
        id="kt_aside_close_btn"
        class="btn aside-close-btn d-lg-none"
        aria-label="Close menu"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
    <div><hr></div>
  </div>
  <!-- end:: Aside -->
</template>

<style lang="scss" scoped>
.aside-toggle {
  outline: none;
}
.brand {
  height: auto !important;
  background-color: #1B2134 !important;
  padding: 1.25rem 1.25rem;
}
.brand-logo-img {
  height: 40px;
  width: auto;
  display: block;
}
.aside-close-btn {
  color: rgba(255, 255, 255, 0.65);
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.35rem 0.6rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.08);
  }
}
</style>

<script>
import { mapGetters } from "vuex";

export default {
  name: "KTBrand",
  mounted() {
  },
  methods: {
  },
  computed: {
    ...mapGetters(["layoutConfig","currentUser"]),

    allowMinimize() {
      return !!this.layoutConfig("aside.self.minimize.toggle");
    },
  }
};
</script>
