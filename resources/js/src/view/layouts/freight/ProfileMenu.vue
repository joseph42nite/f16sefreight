<template>
  <!-- Top right of the header: who is signed in, their company, branch and plan, and Sign out (user, 2026-09-16). -->
  <div class="fx-profile">
    <button class="fx-profile__trigger" :aria-expanded="String(open)" aria-haspopup="true" @click="toggle">
      <span class="fx-profile__avatar" aria-hidden="true">{{ initials }}</span>
      <span class="fx-profile__role">{{ designation }}<template v-if="tier"> · {{ tier }}</template></span>
      <span aria-hidden="true">▾</span>
    </button>

    <div v-if="open" class="fx-profile__panel" role="menu">
      <p v-if="!profile" class="fx-muted">Loading…</p>
      <template v-else>
        <p class="fx-profile__name">{{ profile.name }}</p>
        <p class="fx-muted fx-profile__email">{{ profile.email }}</p>
        <dl class="fx-profile__facts">
          <dt>Role</dt><dd>{{ profile.designation || "—" }}</dd>
          <dt>Company</dt><dd>{{ profile.company || "—" }}</dd>
          <dt>Branch</dt><dd>{{ profile.branch || "—" }}</dd>
          <dt>Plan</dt><dd><span class="fx-profile__plan">{{ planLabel }}</span></dd>
        </dl>
      </template>
      <button class="fx-btn fx-profile__signout" role="menuitem" :disabled="signingOut" @click="signOut">
        {{ signingOut ? "Signing out…" : "Sign out" }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ApiService from "@/core/services/api.service";
import { LOGOUT } from "@/core/services/store/auth.module";

const PLANS = { core: "Core", tactical: "Tactical", command: "Command" };

export default {
  name: "ProfileMenu",
  data: () => ({ open: false, profile: null, signingOut: false }),
  computed: {
    ...mapGetters(["designation", "tier"]),
    initials() {
      const name = (this.profile && this.profile.name) || this.designation || "?";
      return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
    },
    planLabel() {
      const tier = (this.profile && this.profile.tier) || this.tier;
      return PLANS[tier] || "—";
    },
  },
  mounted() {
    document.addEventListener("click", this.closeOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeOutside);
  },
  methods: {
    toggle() {
      this.open = !this.open;
      if (this.open && !this.profile) {
        ApiService.get("/me").then(({ data }) => { this.profile = data.profile; }).catch(() => {});
      }
    },
    closeOutside(e) {
      if (this.open && !this.$el.contains(e.target)) this.open = false;
    },
    /** End the token on the server, forget it here, and go back to this portal's sign-in page. */
    signOut() {
      this.signingOut = true;
      ApiService.post("/user/logout", {})
        .catch(() => {})
        .then(() => this.$store.dispatch(LOGOUT))
        .then(() => this.$router.push("/sign-in").catch(() => {}))
        .finally(() => { this.signingOut = false; this.open = false; });
    },
  },
};
</script>

<style>
.fx-profile { position: relative; }
.fx-profile__trigger {
  display: inline-flex; align-items: center; gap: var(--space-2);
  padding: 2px var(--space-2); background: none; border: 1px solid transparent; border-radius: var(--radius-sm);
  color: var(--text-secondary); font-size: .8125rem; cursor: pointer;
}
.fx-profile__trigger:hover, .fx-profile__trigger[aria-expanded="true"] { border-color: var(--border); }
.fx-profile__avatar {
  display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: 50%;
  background: var(--portal-accent, #355594); color: #fff; font-size: .6875rem; font-weight: 600;
}
.fx-profile__role { text-transform: capitalize; }
.fx-profile__panel {
  position: absolute; right: 0; top: calc(100% + 6px); z-index: 30; width: 260px;
  padding: var(--space-3); background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: var(--radius-sm); box-shadow: 0 6px 20px rgba(0, 0, 0, .12);
}
.fx-profile__name { margin: 0; font-weight: 600; }
.fx-profile__email { margin: 2px 0 var(--space-3); font-size: .75rem; word-break: break-all; }
.fx-profile__facts { display: grid; grid-template-columns: auto 1fr; gap: 4px var(--space-3); margin: 0 0 var(--space-3); font-size: .8125rem; }
.fx-profile__facts dt { color: var(--text-secondary); }
.fx-profile__facts dd { margin: 0; text-transform: capitalize; }
.fx-profile__plan { font-weight: 600; }
.fx-profile__signout { width: 100%; }
</style>
