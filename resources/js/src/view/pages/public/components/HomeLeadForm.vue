<template>
  <!--
    Talk to us (owner, 2026-11-16): a short form for forwarders who want a walkthrough. Work emails only, so the team
    can filter real companies from personal sign-ups, and the person's designation, so they know who they're talking
    to. The browser warns early (workEmail.js); the server decides (POST /api/talk-to-us → ContactController@storeLead,
    App\Support\WorkEmail, rate limited). Entries land in Superadmin → Contacts with company and designation.
  -->
  <section id="talk-to-us" class="llf" aria-labelledby="talk-heading">
    <!-- On the sky card, like the hero and the "Stop guessing" banner (owner, 2026-11-16): blue, clouds, white words. -->
    <div class="llf-sky">
    <img class="llf-cloud llf-cloud--a" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
    <img class="llf-cloud llf-cloud--b" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
    <header class="lp-head">
      <span class="lp-eyebrow">Talk to us</span>
      <h2 id="talk-heading" class="lp-title">See F16s on your<br />own shipments.</h2>
      <p class="lp-sub">Tell us who you are and we'll set up a walkthrough with your team.</p>
    </header>

      <transition name="llf-swap" mode="out-in">
        <div v-if="sent" key="sent" class="llf-panel llf-done" role="status">
          <span class="llf-done__icon"><b-icon icon="check2" aria-hidden="true"></b-icon></span>
          <h3>Thanks, {{ firstName }}.</h3>
          <p>{{ sent }}</p>
        </div>

        <!-- The fields sit in the white panel; the button sits on the blue under it, like the hero's (2026-11-16). -->
        <form v-else key="form" novalidate @submit.prevent="submit">
          <div class="llf-panel">
          <div class="llf-form">
          <!-- Each field is one white box: an icon, a small label, and the input under it (2026-11-16). -->
          <div class="llf-field">
            <label class="llf-box" :class="{ 'is-bad': errors.name, 'is-filled': form.name }" for="llf-name">
              <span class="llf-ico"><b-icon icon="person" aria-hidden="true"></b-icon></span>
              <span class="llf-in">
                <span class="llf-label">Full name</span>
                <input id="llf-name" v-model.trim="form.name" type="text" autocomplete="name" maxlength="120" placeholder="Priya Nair" :aria-invalid="errors.name ? 'true' : 'false'" />
              </span>
            </label>
            <small v-if="errors.name" class="llf-err">{{ errors.name }}</small>
          </div>

          <div class="llf-field">
            <label class="llf-box" :class="{ 'is-bad': errors.email, 'is-filled': form.email }" for="llf-email">
              <span class="llf-ico"><b-icon icon="envelope" aria-hidden="true"></b-icon></span>
              <span class="llf-in">
                <span class="llf-label">Work email</span>
                <input id="llf-email" v-model.trim="form.email" type="email" autocomplete="email" maxlength="150" placeholder="name@yourcompany.com"
                       :aria-invalid="errors.email ? 'true' : 'false'" aria-describedby="llf-email-hint" @blur="checkEmail" @input="errors.email && checkEmail()" />
              </span>
            </label>
            <small v-if="errors.email" class="llf-err">{{ errors.email }}</small>
            <small v-else id="llf-email-hint" class="llf-hint">Company addresses only, no Gmail or Outlook.</small>
          </div>

          <div class="llf-field">
            <label class="llf-box" :class="{ 'is-bad': errors.company, 'is-filled': form.company }" for="llf-company">
              <span class="llf-ico"><b-icon icon="building" aria-hidden="true"></b-icon></span>
              <span class="llf-in">
                <span class="llf-label">Company</span>
                <input id="llf-company" v-model.trim="form.company" type="text" autocomplete="organization" maxlength="150" placeholder="Your company's name" :aria-invalid="errors.company ? 'true' : 'false'" />
              </span>
            </label>
            <small v-if="errors.company" class="llf-err">{{ errors.company }}</small>
          </div>

          <!-- A real dropdown (owner: the suggestion list didn't open). "Other" opens a box to type the title. -->
          <div class="llf-field">
            <label class="llf-box llf-box--select" :class="{ 'is-bad': errors.designation, 'is-filled': role }" for="llf-designation">
              <span class="llf-ico"><b-icon icon="briefcase" aria-hidden="true"></b-icon></span>
              <span class="llf-in">
                <span class="llf-label">Designation</span>
                <select id="llf-designation" v-model="role" :class="{ 'is-empty': !role }" :aria-invalid="errors.designation ? 'true' : 'false'">
                  <option value="" disabled>Choose your role</option>
                  <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
                  <option value="__other">Other</option>
                </select>
              </span>
              <b-icon class="llf-caret" icon="chevron-down" aria-hidden="true"></b-icon>
            </label>
            <label v-if="role === '__other'" class="llf-box llf-box--sub" :class="{ 'is-bad': errors.designation }" for="llf-designation-other">
              <span class="llf-in">
                <span class="llf-label">Your designation</span>
                <input id="llf-designation-other" ref="other" v-model.trim="otherRole" type="text" autocomplete="organization-title" maxlength="100" placeholder="e.g. Branch Head" />
              </span>
            </label>
            <small v-if="errors.designation" class="llf-err">{{ errors.designation }}</small>
          </div>

          <div class="llf-field">
            <label class="llf-box" :class="{ 'is-filled': form.phone }" for="llf-phone">
              <span class="llf-ico"><b-icon icon="telephone" aria-hidden="true"></b-icon></span>
              <span class="llf-in">
                <span class="llf-label">Phone <em>optional</em></span>
                <input id="llf-phone" v-model.trim="form.phone" type="tel" autocomplete="tel" maxlength="30" placeholder="+91 98xxx xxxxx" />
              </span>
            </label>
            <small v-if="errors.phone" class="llf-err">{{ errors.phone }}</small>
          </div>

          <div class="llf-field llf-field--wide">
            <label class="llf-box llf-box--area" :class="{ 'is-filled': form.message }" for="llf-message">
              <span class="llf-ico"><b-icon icon="chat-left-text" aria-hidden="true"></b-icon></span>
              <span class="llf-in">
                <span class="llf-label">What would you like to see? <em>optional</em></span>
                <textarea id="llf-message" v-model.trim="form.message" rows="3" maxlength="2000"
                          placeholder="Air exports, sea consols, accounts… anything you'd like us to show you."></textarea>
              </span>
            </label>
          </div>

          </div>
          <p v-if="failed" class="llf-err llf-err--top" role="alert">{{ failed }}</p>
          </div>
          <div class="llf-foot">
            <lp-button type="submit" :icon="sending ? '' : 'arrow-right'" :disabled="sending">{{ sending ? "Sending…" : "Request a walkthrough" }}</lp-button>
          </div>
        </form>
      </transition>
    </div>
  </section>
</template>

<script>
import ApiService from "@/core/services/api.service";
import { workEmailProblem } from "./workEmail";
import LpButton from "./LpButton.vue";

const blank = () => ({ name: "", email: "", company: "", designation: "", phone: "", message: "" });

export default {
  name: "HomeLeadForm",
  components: { LpButton },
  data: () => ({
    form: blank(),
    errors: {},
    sending: false,
    sent: "",
    failed: "",
    role: "",
    otherRole: "",
    roles: ["Owner / Director", "General Manager", "Operations Manager", "Pricing Manager", "Sales Manager", "Accounts Manager", "IT Manager"],
  }),
  watch: {
    // The dropdown fills form.designation; "Other" takes what they type instead.
    role(value) {
      this.form.designation = value === "__other" ? this.otherRole : value;
      if (value === "__other") this.$nextTick(() => this.$refs.other && this.$refs.other.focus());
      if (this.errors.designation && this.form.designation) this.$delete(this.errors, "designation");
    },
    otherRole(value) {
      if (this.role === "__other") this.form.designation = value;
    },
  },
  computed: {
    firstName() {
      return (this.form.name || "").split(" ")[0] || "there";
    },
  },
  methods: {
    checkEmail() {
      this.$set(this.errors, "email", workEmailProblem(this.form.email));
    },
    validate() {
      const e = {};
      if (!this.form.name) e.name = "Your name is needed.";
      const email = workEmailProblem(this.form.email);
      if (email) e.email = email;
      if (!this.form.company) e.company = "Your company is needed.";
      if (!this.form.designation) e.designation = this.role === "__other" ? "Type your designation." : "Choose your designation.";
      this.errors = e;
      return Object.keys(e).length === 0;
    },
    submit() {
      this.failed = "";
      if (this.sending || !this.validate()) return;
      this.sending = true;
      ApiService.post("/talk-to-us", { ...this.form })
        .then(({ data }) => {
          this.sent = (data && data.message) || "Our team will be in touch soon.";
        })
        .catch((error) => {
          const res = error && error.response;
          if (res && res.status === 422 && res.data && res.data.errors) {
            const e = {};
            Object.keys(res.data.errors).forEach((k) => { e[k] = res.data.errors[k][0]; });
            this.errors = e;
          } else if (res && res.status === 429) {
            this.failed = "Too many tries. Please wait a minute and send it again.";
          } else {
            this.failed = "We couldn't send that just now. Please try again in a moment.";
          }
        })
        .finally(() => { this.sending = false; });
    },
  },
};
</script>

<style>
.llf { padding: 56px 0 88px; font-family: "Inter", sans-serif; }

/* The sky card: the hero's blues and clouds; the heading turns white, the form sits on it in a white panel. */
.llf-sky {
  position: relative; isolation: isolate; overflow: clip; padding: 76px 32px 64px; border-radius: 36px;
  background: linear-gradient(180deg, #6FA9F2 0%, #9CC6F7 55%, #CFE4FC 100%);
}
.llf-cloud { position: absolute; z-index: -1; pointer-events: none; mix-blend-mode: screen; }
.llf-cloud--a { left: -180px; top: 18%; width: 600px; opacity: .7; animation: llf-drift 48s ease-in-out infinite alternate; }
.llf-cloud--b { right: -170px; bottom: -60px; width: 560px; opacity: .65; transform: scaleX(-1); animation: llf-drift-b 60s ease-in-out infinite alternate; }
@keyframes llf-drift { to { transform: translateX(120px); } }
@keyframes llf-drift-b { to { transform: scaleX(-1) translateX(100px); } }
.llf-sky .lp-eyebrow { color: rgba(255, 255, 255, .88); }
.llf-sky .lp-title { color: #fff; text-shadow: 0 2px 18px rgba(30, 80, 160, .28); }
.llf-sky .lp-sub { color: rgba(255, 255, 255, .94); text-shadow: 0 1px 10px rgba(30, 80, 160, .3); }

.llf-panel {
  position: relative; max-width: 820px; margin: 40px auto 0; padding: 36px 40px; border-radius: 30px;
  background: rgba(255, 255, 255, .94); backdrop-filter: blur(10px); box-shadow: 0 30px 70px rgba(30, 70, 150, .22);
}

.llf-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 18px; }
.llf-field { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.llf-field--wide { grid-column: 1 / -1; }

/* One white box per field: icon on the left, a small label over the input. The whole box is the click target. */
.llf-box {
  position: relative; display: flex; align-items: center; gap: 12px; margin: 0; padding: 10px 16px 10px 12px; min-height: 64px;
  border: 1.5px solid #E2E8F2; border-radius: 18px; background: #fff; cursor: text;
  box-shadow: 0 1px 2px rgba(30, 58, 110, .04); transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}
.llf-box:hover { border-color: #C9D6EA; }
.llf-box:focus-within { border-color: #3E8BEA; box-shadow: 0 0 0 4px rgba(62, 139, 234, .14); }
.llf-box.is-bad { border-color: #E5484D; background: #FFFAFA; }
.llf-box.is-bad:focus-within { box-shadow: 0 0 0 4px rgba(229, 72, 77, .12); }
.llf-ico {
  flex: 0 0 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; background: #F1F5FB; color: #8A99B4; font-size: 1.0625rem;
  transition: background .2s ease, color .2s ease;
}
.llf-box:focus-within .llf-ico, .llf-box.is-filled .llf-ico { background: #E6F0FD; color: #2F6FCF; }
.llf-box.is-bad .llf-ico { background: #FDECEC; color: #C62F35; }
.llf-in { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.llf-label { font-size: .75rem; font-weight: 600; letter-spacing: .01em; color: #6B7A93; }
.llf-label em { margin-left: 4px; font-style: normal; font-weight: 500; color: #A8B4C8; }
.llf-box input, .llf-box textarea, .llf-box select {
  width: 100%; padding: 0; border: 0; outline: 0; background: transparent; box-shadow: none;
  font: 500 .9875rem "Inter", sans-serif; color: #102552;
}
.llf-box input::placeholder, .llf-box textarea::placeholder { color: #B3BED0; font-weight: 400; }
.llf-box textarea { resize: vertical; min-height: 66px; line-height: 1.5; }
.llf-box--area { align-items: flex-start; }
.llf-box--area .llf-ico { margin-top: 2px; }

/* The dropdown: native select (works everywhere, keyboard and phone pickers), dressed to match. */
.llf-box--select { cursor: pointer; padding-right: 40px; }
.llf-box select { appearance: none; -webkit-appearance: none; -moz-appearance: none; cursor: pointer; height: 22px; }
.llf-box select.is-empty { color: #B3BED0; font-weight: 400; }
.llf-box select option { color: #102552; }
.llf-caret { position: absolute; right: 16px; top: 50%; margin-top: -8px; color: #8A99B4; pointer-events: none; transition: transform .2s ease, color .2s ease; }
.llf-box--select:focus-within .llf-caret { color: #2F6FCF; transform: rotate(180deg); }
.llf-box--sub { min-height: 56px; margin-top: 8px; padding-left: 16px; }

.llf-hint { padding-left: 4px; font-size: .75rem; color: #6B7A93; }
.llf-err { padding-left: 4px; font-size: .75rem; line-height: 1.4; color: #C62F35; }
.llf-err--top { margin: 16px 0 0; text-align: center; font-size: .8125rem; }

.llf-foot { display: flex; justify-content: center; margin-top: 28px; }

.llf-done { padding: 24px 0 12px; text-align: center; }
.llf-done__icon { display: inline-grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; background: #DCF5E7; color: #137A47; font-size: 1.75rem; }
.llf-done h3 { margin: 16px 0 6px; font-size: 1.5rem; font-weight: 600; letter-spacing: -.02em; color: #102552; }
.llf-done p { margin: 0; font-size: .9375rem; color: #4B5B78; }

.llf-swap-enter-active, .llf-swap-leave-active { transition: opacity .25s ease, transform .25s ease; }
.llf-swap-enter, .llf-swap-leave-to { opacity: 0; transform: translateY(8px); }

@media (max-width: 767px) {
  .llf-form { grid-template-columns: 1fr; }
  .llf-sky { padding: 56px 14px 20px; border-radius: 26px; }
  .llf-panel { padding: 26px 20px; border-radius: 24px; }
  .llf-foot .lp-btn { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .llf-box, .llf-ico, .llf-caret { transition: none; }
  .llf-swap-enter-active, .llf-swap-leave-active { transition: none; }
  .llf-cloud { animation: none; }
}
</style>
