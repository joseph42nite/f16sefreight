<template>
  <!--
    The last word on the landing page (redesigned 2026-11-16, owner): the hero's sky once more, now with a story. The
    F16s jet takes off from a runway at the foot of the card and climbs away on a contrail, over and over. Three short
    steps say what happens after you get in touch. "Get started" goes to the Talk to us form just above.
  -->
  <section class="lc" aria-labelledby="cta-heading">
    <div class="lc-card">
      <img class="lc-cloud lc-cloud--a" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
      <img class="lc-cloud lc-cloud--b" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />

      <!-- Runway and take-off, behind the words. -->
      <svg class="lc-sky" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <symbol id="lc-jet" viewBox="0 0 24 24">
            <path d="M12 1.2 C12.9 2.3 13.3 4 13.3 6.2 V9.4 L21.2 14.4 V16.3 L13.3 13.9 L13.1 18.1 L16.2 20.4 V21.9 L12 20.9 L7.8 21.9 V20.4 L10.9 18.1 L10.7 13.9 L2.8 16.3 V14.4 L10.7 9.4 V6.2 C10.7 4 11.1 2.3 12 1.2 Z" />
          </symbol>
          <linearGradient id="lc-runway" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#FFFFFF" stop-opacity=".35" /><stop offset="1" stop-color="#FFFFFF" stop-opacity=".75" />
          </linearGradient>
          <linearGradient id="lc-trail" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stop-color="#fff" stop-opacity="0" /><stop offset=".5" stop-color="#fff" stop-opacity=".55" /><stop offset="1" stop-color="#fff" stop-opacity=".9" />
          </linearGradient>
          <filter id="lc-soft"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1E3A6E" flood-opacity=".3" /></filter>
        </defs>

        <!-- The runway, in perspective, with its centre line and edge lights. -->
        <path d="M300 520 L560 438 H640 L900 520 Z" fill="url(#lc-runway)" />
        <path class="lc-centre" d="M600 520 V440" stroke="#fff" stroke-width="5" stroke-dasharray="16 14" />
        <g fill="#FFE9A3">
          <circle class="lc-light" cx="352" cy="503" r="3.5" /><circle class="lc-light lc-light--2" cx="440" cy="476" r="3" /><circle class="lc-light lc-light--3" cx="515" cy="452" r="2.4" />
          <circle class="lc-light" cx="848" cy="503" r="3.5" /><circle class="lc-light lc-light--2" cx="760" cy="476" r="3" /><circle class="lc-light lc-light--3" cx="685" cy="452" r="2.4" />
        </g>

        <!-- The climb: a faint route, the contrail, and the jet flying it. -->
        <path id="lc-route" d="M600 470 C640 390 720 320 810 250 S950 110 1000 50" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round" />
        <path class="lc-contrail" d="M600 470 C640 390 720 320 810 250 S950 110 1000 50" fill="none" stroke="url(#lc-trail)" stroke-width="5" stroke-linecap="round" pathLength="1" />
        <g class="lc-plane" filter="url(#lc-soft)">
          <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".55 0 .35 1"><mpath href="#lc-route" /></animateMotion>
          <use href="#lc-jet" x="-26" y="-26" width="52" height="52" fill="#fff" transform="rotate(90)" />
        </g>
      </svg>

      <div class="lc-copy">
        <span class="lc-eyebrow">Ready when you are</span>
        <h2 id="cta-heading" class="lc-title">Stop guessing.<br />Start running every shipment.</h2>
        <p class="lc-sub">See your own mails, jobs and airlines on one board. We will set it up with you.</p>
        <div class="lc-ctas">
          <lp-button href="#talk-to-us" icon="arrow-right" @click="toForm">Get started</lp-button>
          <lp-button to="/product-description" variant="ghost">See how it works</lp-button>
        </div>

        <ol class="lc-steps">
          <li><span>1</span>Tell us about your team</li>
          <li><span>2</span>We set it up with you</li>
          <li><span>3</span>Your first shipment on F16s</li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
import LpButton from "./LpButton.vue";

export default {
  name: "HomeCta",
  components: { LpButton },
  methods: {
    // "Get started" goes to the Talk to us form just above.
    toForm(e) {
      if (e && e.preventDefault) e.preventDefault();
      const el = document.getElementById("talk-to-us");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else this.$router.push("/contact-us");
    },
  },
};
</script>

<style>
.lc { padding: 56px 0 88px; font-family: "Inter", sans-serif; }
.lc-card {
  position: relative; isolation: isolate; overflow: clip;
  padding: 84px 24px 200px; border-radius: 36px; text-align: center; color: #fff;
  background: linear-gradient(180deg, #6FA9F2 0%, #9CC6F7 55%, #CFE4FC 100%);
}
.lc-cloud { position: absolute; z-index: -1; pointer-events: none; mix-blend-mode: screen; }
.lc-cloud--a { left: -170px; top: 40%; width: 560px; opacity: .7; animation: lc-drift 46s ease-in-out infinite alternate; }
.lc-cloud--b { right: -150px; top: -90px; width: 460px; opacity: .55; transform: scaleX(-1); animation: lc-drift-b 58s ease-in-out infinite alternate; }
@keyframes lc-drift { to { transform: translateX(120px); } }
@keyframes lc-drift-b { to { transform: scaleX(-1) translateX(100px); } }

.lc-sky { position: absolute; left: 0; right: 0; bottom: 0; z-index: -1; width: 100%; height: 100%; pointer-events: none; }
.lc-centre { animation: lc-roll 1.2s linear infinite; }
@keyframes lc-roll { to { stroke-dashoffset: -30; } }
.lc-light { animation: lc-blink 1.8s ease-in-out infinite; }
.lc-light--2 { animation-delay: .3s; }
.lc-light--3 { animation-delay: .6s; }
@keyframes lc-blink { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
/* The contrail draws in behind the jet, then fades, in step with its 7s climb. */
.lc-contrail { stroke-dasharray: 1; stroke-dashoffset: 1; animation: lc-trail 7s cubic-bezier(.55, 0, .35, 1) infinite; }
@keyframes lc-trail { 0% { stroke-dashoffset: 1; opacity: 1; } 80% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }

.lc-copy { position: relative; }
.lc-eyebrow {
  display: inline-block; padding: 7px 16px; border-radius: 999px;
  background: rgba(255, 255, 255, .18); border: 1px solid rgba(255, 255, 255, .4);
  font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
}
.lc-title { margin: 20px 0 14px; color: #fff; font-size: clamp(2rem, 4.4vw, 3.5rem); line-height: 1.06; font-weight: 600; letter-spacing: -.04em; text-shadow: 0 2px 18px rgba(30, 80, 160, .28); }
.lc-sub { margin: 0 auto 30px; max-width: 480px; font-size: 1.0625rem; line-height: 1.6; font-weight: 500; text-shadow: 0 1px 10px rgba(30, 80, 160, .3); }
.lc-ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
/* Buttons: LpButton.vue. */

/* What happens next, as three small glass pills joined by a line. */
.lc-steps { position: relative; display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 10px 28px; list-style: none; margin: 34px 0 0; padding: 0; }
.lc-steps li {
  position: relative; display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px 8px 8px; border-radius: 999px;
  background: rgba(47, 111, 207, .28); border: 1px solid rgba(255, 255, 255, .5); backdrop-filter: blur(6px);
  font-size: .875rem; font-weight: 600; text-shadow: 0 1px 8px rgba(30, 80, 160, .25);
}
.lc-steps li + li::before { content: ""; position: absolute; right: 100%; top: 50%; width: 28px; border-top: 2px dashed rgba(255, 255, 255, .6); }
.lc-steps span { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: #fff; color: #2F6FCF; font-size: .75rem; font-weight: 700; text-shadow: none; }

@media (max-width: 767px) {
  .lc-card { padding: 60px 18px 170px; border-radius: 26px; }
  .lc-steps { flex-direction: column; align-items: center; gap: 10px; }
  .lc-steps li + li::before { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .lc-cloud, .lc-centre, .lc-light, .lc-contrail { animation: none; }
  .lc-contrail { stroke-dashoffset: 0; }
  .lc-plane { display: none; }
}
</style>
