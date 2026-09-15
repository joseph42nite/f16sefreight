<template>
  <main class="fx-signin">
    <section class="fx-signin__card" aria-labelledby="fx-signin-title">
      <p class="fx-signin__brand">F16s</p>
      <h1 id="fx-signin-title" class="fx-signin__title">{{ portalLabel }}</h1>
      <p class="fx-signin__sub">Sign in to continue</p>

      <form class="fx-signin__form" @submit.prevent="signIn">
        <p v-if="error" class="fx-signin__error" role="alert">{{ error }}</p>

        <label class="fx-signin__field">
          <span>Email</span>
          <input v-model.trim="email" type="email" autocomplete="username" required />
        </label>

        <label class="fx-signin__field">
          <span>Password</span>
          <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required />
        </label>
        <button type="button" class="fx-signin__link fx-signin__show" @click="showPassword = !showPassword">
          {{ showPassword ? "Hide password" : "Show password" }}
        </button>

        <button type="submit" class="fx-signin__submit" :disabled="busy">{{ busy ? "Signing in…" : "Sign in" }}</button>
      </form>

      <!-- Superadmin is F16s staff only: no other portal is offered there. -->
      <div v-if="portal !== 'superadmin'" class="fx-signin__switch">
        <button type="button" class="fx-signin__link" :aria-expanded="String(switching)" @click="switching = !switching">
          Not {{ portalLabel }}? Switch portal
        </button>
        <ul v-if="switching" class="fx-signin__portals">
          <li v-for="p in otherPortals" :key="p.key">
            <a :href="signInUrl(p.key)">{{ p.label }} <span>{{ p.note }}</span></a>
          </li>
        </ul>
      </div>

      <p class="fx-signin__foot">
        <a :href="siteUrl('/contact-us')">Forgot password?</a>
        <a :href="siteUrl('/')">About F16s</a>
      </p>
    </section>
  </main>
</template>

<script>
import { LOGIN } from "@/core/services/store/auth.module";
import { mainSiteUrl, portalFromHost, portalSignInUrl, SIGN_IN_PORTALS } from "@/core/config/portalHosts";

/** Server error codes, in words (the same set the website's sign-in box shows). */
const MESSAGES = {
  Unauthorized: "Invalid email or password.",
  Blocked: "Account blocked. Contact your admin.",
  Daily_Limit: "Daily sign-in limit exceeded.",
  Expired: "Plan expired. Please renew.",
};

/**
 * A portal's own sign-in page (user, 2026-09-15): focusair.<domain> and the rest open here, with nothing
 * from the company website — that lives on the main domain, linked below.
 */
export default {
  name: "PortalSignIn",
  data: () => ({
    portal: portalFromHost(window.location.hostname),
    email: "", password: "", showPassword: false,
    busy: false, error: null, switching: false,
  }),
  computed: {
    portalLabel() {
      if (this.portal === "superadmin") return "Platform Admin";
      const known = SIGN_IN_PORTALS.find((p) => p.key === this.portal);
      return known ? known.label : "F16s";
    },
    otherPortals() {
      return SIGN_IN_PORTALS.filter((p) => p.key !== this.portal);
    },
  },
  created() {
    document.title = this.portalLabel + " · Sign in";
  },
  methods: {
    signIn() {
      this.busy = true;
      this.error = null;

      // The LOGIN action takes the user to their landing page.
      this.$store.dispatch(LOGIN, { email: this.email, password: this.password })
        .catch(() => {
          const code = this.$store.state.auth.errors;
          this.error = MESSAGES[code] || (typeof code === "string" ? code : "Could not sign in.");
        })
        .finally(() => { this.busy = false; });
    },
    signInUrl(key) {
      return portalSignInUrl(key, window.location);
    },
    siteUrl(path) {
      return mainSiteUrl(window.location, path);
    },
  },
};
</script>

<style scoped>
.fx-signin { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px;
  background: var(--bg-canvas, #f0f2f5); font-family: "Inter", system-ui, sans-serif; }
.fx-signin__card { width: 100%; max-width: 380px; background: var(--bg-surface, #fff); border: 1px solid var(--border, #e2e6ec);
  border-radius: 12px; padding: 32px 28px; box-shadow: 0 8px 24px rgba(15, 23, 42, .06); }
.fx-signin__brand { margin: 0 0 12px; font-weight: 700; letter-spacing: .02em; color: #355594; }
.fx-signin__title { margin: 0; font-size: 1.5rem; font-weight: 700; color: var(--text-primary, #1e293b); }
.fx-signin__sub { margin: 4px 0 20px; font-size: .875rem; color: var(--text-secondary, #64748b); }
.fx-signin__form { display: flex; flex-direction: column; gap: 12px; }
.fx-signin__field { display: flex; flex-direction: column; gap: 4px; margin: 0; font-size: .8125rem; font-weight: 600; color: var(--text-secondary, #475569); }
.fx-signin__field input { height: 40px; padding: 0 12px; border: 1px solid var(--border, #cbd5e1); border-radius: 8px; font-size: .9375rem; color: var(--text-primary, #1e293b); }
.fx-signin__field input:focus { outline: 2px solid #355594; outline-offset: 0; border-color: #355594; }
.fx-signin__show { align-self: flex-end; margin-top: -6px; }
.fx-signin__submit { height: 42px; margin-top: 4px; border: 0; border-radius: 8px; background: #355594; color: #fff; font-weight: 600; font-size: .9375rem; cursor: pointer; }
.fx-signin__submit:hover { background: #28447a; }
.fx-signin__submit:disabled { opacity: .7; cursor: default; }
.fx-signin__error { margin: 0; padding: 8px 12px; border-radius: 8px; background: #fef2f2; color: #b91c1c; font-size: .8125rem; }
.fx-signin__link { background: none; border: 0; padding: 0; color: #355594; font-size: .8125rem; font-weight: 600; cursor: pointer; }
.fx-signin__switch { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border, #e2e6ec); }
.fx-signin__portals { list-style: none; margin: 8px 0 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.fx-signin__portals a { display: flex; justify-content: space-between; gap: 8px; padding: 8px 10px; border-radius: 8px; color: var(--text-primary, #1e293b); font-size: .875rem; font-weight: 600; text-decoration: none; }
.fx-signin__portals a:hover { background: var(--bg-sunken, #f1f5f9); }
.fx-signin__portals span { color: var(--text-secondary, #64748b); font-weight: 400; font-size: .75rem; }
.fx-signin__foot { display: flex; justify-content: space-between; margin: 20px 0 0; font-size: .8125rem; }
.fx-signin__foot a { color: var(--text-secondary, #64748b); }
</style>
