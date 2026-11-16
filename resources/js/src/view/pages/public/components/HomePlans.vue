<template>
  <!--
    Plans (owner, 2026-11-13): the same card as "One platform. Every way cargo moves." (HomeModes.vue, the shared
    .lm-card styles), so the two sections read as one family. Each plan gets its own picture, all built on the F16s jet:
      Core     — a waybill with a jet "approved" stamp, a jet flying past (documents)
      Tactical — a radar scope sweeping, jobs as blips (operations on one board)
      Command  — command wings: a winged badge under three stars (the whole company)

    What each tier unlocks comes from the code: app/Providers/AuthServiceProvider.php (the tier on each permission) and
    config/f16s.php (AI scan credits: Core 0, Tactical 500, Command 2,000 a month). docs/LANDING_PAGE.md.
  -->
  <section class="lm lpl" aria-labelledby="plans-heading">
    <header class="lp-head">
      <span class="lp-eyebrow">Plans</span>
      <h2 id="plans-heading" class="lp-title">Start small.<br />Add desks as you grow.</h2>
      <p class="lp-sub">Locked features stay visible, so your team can see what an upgrade adds.</p>
    </header>

    <!-- The F16s jet, drawn once (top view, nose up). -->
    <svg class="lpl-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <symbol id="lpl-jet" viewBox="0 0 24 24">
        <path d="M12 1.2 C12.9 2.3 13.3 4 13.3 6.2 V9.4 L21.2 14.4 V16.3 L13.3 13.9 L13.1 18.1 L16.2 20.4 V21.9 L12 20.9 L7.8 21.9 V20.4 L10.9 18.1 L10.7 13.9 L2.8 16.3 V14.4 L10.7 9.4 V6.2 C10.7 4 11.1 2.3 12 1.2 Z" />
      </symbol>
      <filter id="lpl-drop" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#26447F" flood-opacity=".2" />
      </filter>
    </svg>

    <div class="lm-grid">
      <article v-for="plan in plans" :key="plan.name" class="lm-card" :class="'lm-card--' + plan.tone">
        <span class="lm-badge lpl-badge"><i aria-hidden="true"></i>{{ plan.tag }}</span>

        <div class="lpl-art" aria-hidden="true">
          <!-- Core: the waybill. -->
          <svg v-if="plan.art === 'core'" viewBox="0 0 300 180">
            <defs>
              <linearGradient id="lpl-head" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2F6FCF" /><stop offset="1" stop-color="#5B9BEA" /></linearGradient>
            </defs>
            <path id="lpl-trail" d="M20 52 C90 14 200 10 284 34" fill="none" stroke="#2F6FCF" stroke-opacity=".35" stroke-width="2" stroke-dasharray="3 7" stroke-linecap="round" />
            <g fill="#1E3A6E">
              <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"><mpath href="#lpl-trail" /></animateMotion>
              <use href="#lpl-jet" x="-12" y="-12" width="24" height="24" transform="rotate(90)" />
            </g>
            <g transform="rotate(-5 150 112)" filter="url(#lpl-drop)">
              <rect x="96" y="50" width="112" height="124" rx="8" fill="#fff" />
              <path d="M96 58 a8 8 0 0 1 8 -8 h96 a8 8 0 0 1 8 8 v10 h-112 Z" fill="url(#lpl-head)" />
              <rect x="106" y="56" width="34" height="5" rx="2.5" fill="#fff" fill-opacity=".85" />
              <rect x="108" y="80" width="62" height="5" rx="2.5" fill="#E3E8F0" />
              <rect x="108" y="90" width="84" height="5" rx="2.5" fill="#E3E8F0" />
              <rect x="108" y="100" width="48" height="5" rx="2.5" fill="#E3E8F0" />
              <rect x="108" y="112" width="40" height="16" rx="4" fill="#EEF3FA" />
              <rect x="152" y="112" width="44" height="16" rx="4" fill="#EEF3FA" />
              <g fill="#3A4558">
                <rect x="108" y="140" width="2" height="22" /><rect x="112" y="140" width="1" height="22" /><rect x="115" y="140" width="3" height="22" />
                <rect x="120" y="140" width="1" height="22" /><rect x="123" y="140" width="2" height="22" /><rect x="127" y="140" width="1" height="22" />
                <rect x="130" y="140" width="3" height="22" /><rect x="135" y="140" width="1" height="22" /><rect x="138" y="140" width="2" height="22" />
                <rect x="142" y="140" width="1" height="22" /><rect x="145" y="140" width="3" height="22" /><rect x="150" y="140" width="1" height="22" />
              </g>
              <g class="lpl-stamp" transform="rotate(-14 182 146)">
                <circle cx="182" cy="146" r="19" fill="#fff" fill-opacity=".6" stroke="#1E3A6E" stroke-width="2.5" />
                <circle cx="182" cy="146" r="14" fill="none" stroke="#1E3A6E" stroke-width="1" stroke-dasharray="2 2.5" />
                <use href="#lpl-jet" x="174" y="138" width="16" height="16" fill="#1E3A6E" />
              </g>
            </g>
          </svg>

          <!-- Tactical: the radar scope, jobs as blips, and job cards floating beside it. -->
          <svg v-else-if="plan.art === 'tactical'" viewBox="0 0 300 180">
            <defs>
              <radialGradient id="lpl-scope" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#2B4F8F" /><stop offset="1" stop-color="#0F2147" /></radialGradient>
              <linearGradient id="lpl-bezel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" /><stop offset="1" stop-color="#D5DCE8" /></linearGradient>
              <linearGradient id="lpl-sweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7FF0D8" stop-opacity="0" /><stop offset="1" stop-color="#7FF0D8" stop-opacity=".55" /></linearGradient>
            </defs>
            <g filter="url(#lpl-drop)"><circle cx="150" cy="94" r="76" fill="url(#lpl-bezel)" /></g>
            <circle cx="150" cy="94" r="67" fill="url(#lpl-scope)" />
            <g fill="none" stroke="#7FF0D8" stroke-opacity=".28">
              <circle cx="150" cy="94" r="22" /><circle cx="150" cy="94" r="44" />
              <path d="M150 27 V161 M83 94 H217" />
            </g>
            <g class="lpl-sweep"><path d="M150 94 L150 27 A67 67 0 0 1 207 59 Z" fill="url(#lpl-sweep)" /></g>
            <g fill="#7FF0D8">
              <circle class="lpl-blip" cx="180" cy="72" r="3.5" />
              <circle class="lpl-blip lpl-blip--2" cx="124" cy="120" r="3" />
              <circle class="lpl-blip lpl-blip--3" cx="172" cy="126" r="2.6" />
              <use href="#lpl-jet" x="122" y="52" width="18" height="18" transform="rotate(35 131 61)" />
            </g>
            <circle cx="150" cy="94" r="3" fill="#7FF0D8" />
            <g class="lpl-chip" filter="url(#lpl-drop)">
              <rect x="8" y="34" width="74" height="28" rx="14" fill="#fff" />
              <circle cx="24" cy="48" r="6" fill="#7C5CE6" /><rect x="35" y="44" width="36" height="5" rx="2.5" fill="#D9DEE8" /><rect x="35" y="52" width="22" height="4" rx="2" fill="#E8ECF2" />
            </g>
            <g class="lpl-chip lpl-chip--2" filter="url(#lpl-drop)">
              <rect x="218" y="118" width="74" height="28" rx="14" fill="#fff" />
              <circle cx="234" cy="132" r="6" fill="#16A34A" /><rect x="245" y="128" width="36" height="5" rx="2.5" fill="#D9DEE8" /><rect x="245" y="136" width="22" height="4" rx="2" fill="#E8ECF2" />
            </g>
          </svg>

          <!-- Command: command wings under three stars. -->
          <svg v-else viewBox="0 0 300 180">
            <defs>
              <linearGradient id="lpl-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBE3A0" /><stop offset=".5" stop-color="#E8B652" /><stop offset="1" stop-color="#B98326" /></linearGradient>
              <radialGradient id="lpl-navy" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#3567B8" /><stop offset="1" stop-color="#14295A" /></radialGradient>
              <clipPath id="lpl-shield"><circle cx="150" cy="104" r="31" /></clipPath>
            </defs>
            <g filter="url(#lpl-drop)">
              <g id="lpl-wing" fill="url(#lpl-gold)">
                <path d="M126 92 C98 74 58 68 18 74 C46 84 84 92 126 104 Z" />
                <path d="M126 104 C100 92 68 90 38 96 C62 104 94 110 126 116 Z" />
                <path d="M126 116 C104 108 82 108 60 114 C80 120 104 124 126 126 Z" />
              </g>
              <use href="#lpl-wing" transform="translate(300 0) scale(-1 1)" />
              <circle cx="150" cy="104" r="36" fill="url(#lpl-gold)" />
              <circle cx="150" cy="104" r="31" fill="url(#lpl-navy)" />
              <use href="#lpl-jet" x="134" y="88" width="32" height="32" fill="#fff" />
              <g clip-path="url(#lpl-shield)"><rect class="lpl-shine" x="100" y="60" width="14" height="90" fill="#fff" fill-opacity=".28" /></g>
            </g>
            <g fill="url(#lpl-gold)" stroke="#B98326" stroke-width=".6">
              <polygon transform="translate(124 40) scale(.8)" points="0.0,-10.0 2.5,-3.4 9.5,-3.1 4.0,1.3 5.9,8.1 0.0,4.2 -5.9,8.1 -4.0,1.3 -9.5,-3.1 -2.5,-3.4" />
              <polygon class="lpl-star" transform="translate(150 32) scale(1.1)" points="0.0,-10.0 2.5,-3.4 9.5,-3.1 4.0,1.3 5.9,8.1 0.0,4.2 -5.9,8.1 -4.0,1.3 -9.5,-3.1 -2.5,-3.4" />
              <polygon transform="translate(176 40) scale(.8)" points="0.0,-10.0 2.5,-3.4 9.5,-3.1 4.0,1.3 5.9,8.1 0.0,4.2 -5.9,8.1 -4.0,1.3 -9.5,-3.1 -2.5,-3.4" />
            </g>
          </svg>
        </div>

        <h3>{{ plan.name }}</h3>
        <p>{{ plan.line }}</p>
        <ul class="lm-list">
          <li v-for="point in plan.points" :key="point"><b-icon icon="check2" aria-hidden="true"></b-icon>{{ point }}</li>
        </ul>
        <lp-button class="lm-link" to="/contact-us" size="sm" icon="arrow-right">Ask about {{ plan.name }}</lp-button>
      </article>
    </div>

    <p class="lpl-note">Prices on request. Talk to us and we'll set it up with you.</p>
  </section>
</template>

<script>
import LpButton from "./LpButton.vue";

export default {
  name: "HomePlans",
  components: { LpButton },
  data: () => ({
    plans: [
      {
        name: "Core", tag: "Documents", tone: "sky", art: "core",
        line: "Your waybills and bills of lading, done properly.",
        points: ["MAWB and HAWB, with PDFs", "Sea bills of lading", "Consolidation", "Search across your documents"],
      },
      {
        name: "Tactical", tag: "Everything in Core, plus", tone: "violet", art: "tactical",
        line: "Your operations team on one board, with AI doing the reading.",
        points: ["Roles for pricing, operations, sales and the boss", "Outlook inbox, sorted by AI", "Enquiries, the board and job assigning", "Manifests and the import desk", "AI document reading, 500 scans a month", "Sales and client insights"],
      },
      {
        name: "Command", tag: "Everything in Tactical, plus", tone: "peach", art: "command",
        line: "The whole company, accounts included.",
        points: ["An accounts desk", "Cost sheets, invoices and vouchers", "Ledger, bank reconciliation and month close", "Margins and financial reports for the boss", "Credit holds on delivery orders", "AI document reading, 2,000 scans a month"],
      },
    ],
  }),
};
</script>

<style>
/* Cards, badge, list and link come from HomeModes.vue (.lm-*). Only what's new for plans is here. */
.lpl-defs { position: absolute; width: 0; height: 0; overflow: hidden; }
.lm-card--violet { --c1: #CDBFF8; --c2: #EEE9FD; }
.lm-card--peach { --c1: #FBCDB3; --c2: #FDEDE3; }
.lpl .lpl-badge { color: #2C3A57; }
.lpl .lpl-badge i { background: #2F6FCF; box-shadow: 0 0 0 3px rgba(47, 111, 207, .16); }

.lpl-art { height: 180px; margin: 8px 0 14px; }
.lpl-art svg { display: block; width: 100%; height: 100%; overflow: visible; }

/* Core: the stamp fades and lands again now and then. */
.lpl-stamp { animation: lpl-stamp 4s ease-in-out infinite; }
@keyframes lpl-stamp { 0%, 70%, 100% { opacity: 1; } 80% { opacity: .55; } }

/* Tactical: the sweep turns, the blips glow, the job cards bob. */
.lpl-sweep { transform-box: view-box; transform-origin: 150px 94px; animation: lpl-turn 4s linear infinite; }
@keyframes lpl-turn { to { transform: rotate(360deg); } }
.lpl-blip { animation: lpl-blip 2s ease-in-out infinite; }
.lpl-blip--2 { animation-delay: .7s; }
.lpl-blip--3 { animation-delay: 1.4s; }
@keyframes lpl-blip { 0%, 100% { opacity: .35; } 50% { opacity: 1; } }
.lpl-chip { animation: lpl-bob 5s ease-in-out infinite alternate; }
.lpl-chip--2 { animation-delay: -2.5s; }
@keyframes lpl-bob { from { transform: translateY(-3px); } to { transform: translateY(3px); } }

/* Command: a shine passes over the badge, the middle star twinkles. */
.lpl-shine { transform-box: view-box; transform-origin: 150px 104px; animation: lpl-shine 4.5s ease-in-out infinite; }
@keyframes lpl-shine { 0%, 55% { transform: rotate(20deg) translateX(-20px); } 100% { transform: rotate(20deg) translateX(110px); } }
.lpl-star { animation: lpl-twinkle 3s ease-in-out infinite; }
@keyframes lpl-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }

.lpl-note { margin: 24px 0 0; text-align: center; font-size: .9375rem; color: #6B7A93; }

@media (prefers-reduced-motion: reduce) {
  .lpl-stamp, .lpl-sweep, .lpl-blip, .lpl-chip, .lpl-shine, .lpl-star { animation: none; }
}
</style>
