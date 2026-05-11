<template>
  <!-- begin:: Aside -->
  <div>
  <div class="brand flex-column-auto" id="kt_brand" ref="kt_brand">
    <div class="d-flex align-items-center mt-5 mb-5 ml-5 w-100">
        <div>
            <h4 class="text-nowrap font-weight-bolder text-white mb-0">F16s</h4>
            <span class="text-nowrap text-muted font-size-xs font-weight-bold">ADMIN CONSOLE</span>
        </div>
    </div>
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
  </div>
    <div><hr></div>
  </div>
  <!-- end:: Aside -->
</template>

<style lang="scss" scoped>
.aside-toggle {
  outline: none;
}
.brand{
  height: auto !important;
}
.brand {
    background-color: #1B2134 !important;
}
@media (max-width: 991.98px){
.brand {
    display: -webkit-box !important;
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
