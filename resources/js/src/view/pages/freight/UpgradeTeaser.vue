<template>
  <div class="fx-teaser">
    <h1 class="fx-page-title">Not included on your plan</h1>
    <p class="fx-page-sub">
      <strong>{{ wanted }}</strong> is part of the
      <strong>{{ requiredTier }}</strong> plan. You are currently on
      <strong>{{ tier || 'core' }}</strong>.
    </p>
    <!--
      §8.1 — this screen is the REASON the locked nav item stays visible. Hiding the
      item would hide the reason to upgrade, so the lock leads somewhere that explains
      itself rather than to a dead end.
    -->
    <p class="fx-muted">
      Talk to your administrator to change plan. Nothing on this screen is billed.
    </p>
    <router-link class="fx-btn" :to="landing">Back to my work</router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { LANDING_ROUTE, NAV_ITEMS } from "@/core/config/navigation";

export default {
  name: "UpgradeTeaser",
  computed: {
    ...mapGetters(["tier", "designation"]),
    from() {
      return this.$route.query.from || null;
    },
    item() {
      return NAV_ITEMS.find((i) => i.path === this.from) || null;
    },
    wanted() {
      return this.item ? this.item.label : "This area";
    },
    requiredTier() {
      return (this.item && this.item.minTier) || "command";
    },
    landing() {
      return LANDING_ROUTE[this.designation] || "/focus-air";
    },
  },
};
</script>
