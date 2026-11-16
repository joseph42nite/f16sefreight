<template>
  <!--
    Air, sea and road (landing redesign, 2026-11-12), in place of "Specialized Logistics Services".

    🔴 TRUE STATUS: Focus Air and Focus Sea are built (config/f16s.php portals 'focusair', 'focussea'; sea bills of
    lading in SYSTEM_MAP.md:114-115) — the old page called Sea "Coming Soon". Focus Road is NOT built (no portal), so it
    says so. docs/LANDING_PAGE.md §5.
  -->
  <section class="lm" aria-labelledby="modes-heading">
    <header class="lp-head">
      <span class="lp-eyebrow">Products</span>
      <h2 id="modes-heading" class="lp-title">One platform.<br />Every way cargo moves.</h2>
      <p class="lp-sub">Air and sea on the same board and the same books. Road is next.</p>
    </header>

    <div class="lm-grid">
      <article v-for="m in modes" :key="m.name" class="lm-card" :class="['lm-card--' + m.tone, { 'is-soon': m.soon }]">
        <img v-if="m.scene === 'air'" class="lm-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <span class="lm-badge" :class="{ 'is-live': !m.soon }">
          <i aria-hidden="true"></i>{{ m.soon ? "Coming soon" : "Live" }}
        </span>
        <!-- Each vehicle sits in its own world: the plane in the clouds, the ship in water, the truck on a road. -->
        <div class="lm-scene" :class="'lm-scene--' + m.scene">
          <!-- Sea: hazy horizon, deeper blue towards the front, a soft shimmer, and the ship's reflection. -->
          <div v-if="m.scene === 'sea'" class="lm-water lm-water--back" aria-hidden="true">
            <img class="lm-reflect" :src="m.image" alt="" loading="lazy" />
            <span class="lm-shimmer"></span>
          </div>
          <svg v-if="m.scene === 'road'" class="lm-road" viewBox="0 0 400 190" preserveAspectRatio="none" aria-hidden="true">
            <polygon class="lm-road__side" points="0,98 400,124 400,190 0,158" />
            <polygon class="lm-road__top" points="0,104 400,132 400,190 0,152" />
            <line class="lm-road__edge" x1="0" y1="106" x2="400" y2="134" />
            <line class="lm-road__edge" x1="0" y1="150" x2="400" y2="188" />
            <line class="lm-road__lane" x1="0" y1="128" x2="400" y2="161" />
          </svg>
          <img class="lm-img" :src="m.image" :alt="m.alt" loading="lazy" />
          <div v-if="m.scene === 'sea'" class="lm-water lm-water--front" aria-hidden="true">
            <span class="lm-foam"></span>
            <svg class="lm-wave lm-wave--far" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M0 9 Q8 5 16.7 9 T33.3 9 T50 9 T66.7 9 T83.3 9 T100 9 T116.7 9 T133.3 9 T150 9 T166.7 9 T183.3 9 T200 9 V20 H0Z" />
            </svg>
            <svg class="lm-wave lm-wave--near" viewBox="0 0 200 20" preserveAspectRatio="none">
              <path d="M0 11 Q12.5 6 25 11 T50 11 T75 11 T100 11 T125 11 T150 11 T175 11 T200 11 V20 H0Z" />
            </svg>
          </div>
        </div>
        <h3>{{ m.name }}</h3>
        <p>{{ m.line }}</p>
        <ul class="lm-list">
          <li v-for="b in m.points" :key="b"><b-icon icon="check2" aria-hidden="true"></b-icon>{{ b }}</li>
        </ul>
        <lp-button v-if="!m.soon" class="lm-link" to="/product-description" size="sm" icon="arrow-right">See {{ m.name }}</lp-button>
      </article>
    </div>
  </section>
</template>

<script>
import LpButton from "./LpButton.vue";

export default {
  name: "HomeModes",
  components: { LpButton },
  data: () => ({
    modes: [
      {
        name: "Focus Air", tone: "sky", scene: "air", image: "/media/assets/banners/banner-plane.webp", alt: "A cargo aircraft",
        line: "Air export and import, from the first mail to the airline's last status.",
        points: ["MAWB and HAWB, consolidation and PDFs", "e-AWB to airlines through Descartes", "Airline tracking on every job"],
      },
      {
        name: "Focus Sea", tone: "butter", scene: "sea", image: "/media/assets/banners/banner-ship.webp", alt: "A container ship",
        line: "House and master bills of lading, consolidation and containers.",
        points: ["Bills of lading in 12 guided steps", "AI reads a carrier's BL into the form", "Houses linked to a master, containers stuffed"],
      },
      {
        name: "Focus Road", tone: "mint", scene: "road", image: "/media/assets/banners/banner-truck.webp", alt: "A truck", soon: true,
        line: "Road freight on the same board. We are building it now.",
        points: ["Same board, same books", "Tell us what you need from it"],
      },
    ],
  }),
};
</script>

<style>
.lm { padding: 72px 0 40px; font-family: "Inter", sans-serif; }
.lm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 44px; }
.lm-card {
  --c1: #AFD4F7; --c2: #E2EFFC;
  position: relative; isolation: isolate; overflow: clip;
  display: flex; flex-direction: column; padding: 22px 26px 28px; border-radius: 28px;
  background: linear-gradient(180deg, var(--c1) 0%, var(--c2) 70%);
  transition: transform .25s ease, box-shadow .25s ease;
}
.lm-card:hover { transform: translateY(-4px); box-shadow: 0 22px 44px rgba(38, 68, 127, .14); }
.lm-card--sky { --c1: #AFD4F7; --c2: #E2EFFC; }
.lm-card--mint { --c1: #B9E8CB; --c2: #E6F7EC; }
.lm-card--butter { --c1: #F6DF96; --c2: #FCF4DA; }
.lm-card__cloud { position: absolute; z-index: -1; top: 40px; left: 50%; width: 120%; transform: translateX(-50%); opacity: .8; mix-blend-mode: screen; pointer-events: none; animation: lm-cloud 14s ease-in-out infinite alternate; }
/* The cloud drifts slowly under the plane. */
@keyframes lm-cloud { from { transform: translateX(-56%); } to { transform: translateX(-44%); } }

.lm-badge {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 999px;
  background: rgba(255, 255, 255, .75); font-size: .75rem; font-weight: 600; color: #6B5A1E;
}
.lm-badge i { width: 7px; height: 7px; border-radius: 50%; background: #D69E2E; }
.lm-badge.is-live { color: #137A47; }
.lm-badge.is-live i { background: #16A34A; box-shadow: 0 0 0 3px rgba(22, 163, 74, .18); }

/* The picture area runs to the card's edges so the water and the road meet the sides. */
.lm-scene { position: relative; height: 190px; margin: 8px -26px 14px; padding: 0 26px; }
.lm-img { position: relative; z-index: 1; display: block; width: 100%; height: 170px; object-fit: contain; filter: drop-shadow(0 18px 24px rgba(38, 68, 127, .18)); }

/* Sea: hazy horizon fading into deeper water, a slow shimmer, the ship's reflection, two layers of swell in front
   moving at different speeds, and a little foam where the hull meets the water. */
.lm-water { position: absolute; left: 0; right: 0; }
.lm-water--back {
  top: 116px; bottom: 0; overflow: hidden;
  background: linear-gradient(180deg, #CFE9F3 0%, #8CC6E3 14%, #4E9CCB 55%, #2F78AE 100%);
}
.lm-water--back::before {
  /* Haze on the horizon, so the sea fades into the sky instead of stopping at a line. */
  content: ""; position: absolute; left: 0; right: 0; top: -6px; height: 16px; background: rgba(255, 255, 255, .55); filter: blur(5px);
}
.lm-reflect {
  position: absolute; left: 26px; width: calc(100% - 52px); height: 170px; top: 4px; object-fit: contain;
  transform: scaleY(-1); opacity: .45; filter: blur(1.5px) saturate(.8);
  clip-path: inset(25px 0 0 0);
  animation: lm-wobble 3.2s ease-in-out infinite alternate;
  -webkit-mask-image: linear-gradient(0deg, transparent 35%, #000 85%); mask-image: linear-gradient(0deg, transparent 35%, #000 85%);
}
.lm-shimmer {
  position: absolute; inset: 0;
  background: repeating-linear-gradient(180deg, rgba(255, 255, 255, 0) 0 10px, rgba(255, 255, 255, .22) 10px 12px);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 30%, #000 70%, transparent);
  background-size: 100% 12px;
  animation: lm-ripple 2.6s linear infinite, lm-glint 6s ease-in-out infinite alternate;
}
/* Ripples roll towards you while the glint slides across. */
@keyframes lm-ripple { to { background-position: 0 12px; } }
@keyframes lm-glint { from { opacity: .45; transform: translateX(-10%); } to { opacity: 1; transform: translateX(10%); } }
.lm-water--front { z-index: 2; top: 134px; bottom: 0; overflow: hidden; }
.lm-wave { position: absolute; left: 0; width: 200%; }
.lm-wave--far { top: 0; height: 22px; animation: lm-swell 8s linear infinite; }
.lm-wave--far path { fill: rgba(170, 215, 238, .45); }
.lm-wave--near { top: 6px; bottom: 0; height: auto; animation: lm-swell 4.5s linear infinite reverse; }
.lm-wave--near path { fill: rgba(56, 128, 186, .42); }
.lm-water--front::after {
  content: ""; position: absolute; left: 0; right: 0; top: 18px; bottom: 0; background: linear-gradient(180deg, rgba(56, 128, 186, .42), rgba(40, 104, 160, .55));
}
.lm-foam {
  position: absolute; z-index: 1; left: 22%; right: 12%; top: 6px; height: 7px; border-radius: 50%;
  background: rgba(255, 255, 255, .7); filter: blur(3px); animation: lm-foam 3.5s ease-in-out infinite alternate;
}
@keyframes lm-foam { from { opacity: .5; transform: scaleX(.96); } to { opacity: .9; transform: scaleX(1.02); } }
/* The reflection wavers as the water moves. */
@keyframes lm-wobble { from { transform: scaleY(-1) scaleX(1) skewX(0deg); } to { transform: scaleY(-1) scaleX(1.025) skewX(1.5deg); } }
.lm-scene--sea .lm-img { filter: drop-shadow(0 8px 14px rgba(20, 70, 120, .18)); }
/* The swell rolls sideways and rises and falls a little as it goes. */
@keyframes lm-swell {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-12.5%, 2px); }
  50% { transform: translate(-25%, 0); }
  75% { transform: translate(-37.5%, 2px); }
  100% { transform: translate(-50%, 0); }
}

/* Road: a slate road with white edges and a moving centre line, the truck's wheels on it. */
.lm-road { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
.lm-road__side { fill: #8FCFA6; }
.lm-road__top { fill: #67748A; }
.lm-road__edge { stroke: rgba(255, 255, 255, .85); stroke-width: 2; vector-effect: non-scaling-stroke; }
.lm-road__lane {
  stroke: #FCE9A6; stroke-width: 3; stroke-dasharray: 18 14; vector-effect: non-scaling-stroke;
  animation: lm-drive 1.4s linear infinite;
}
@keyframes lm-drive { to { stroke-dashoffset: 32; } }
.lm-card.is-soon .lm-img { filter: drop-shadow(0 18px 24px rgba(38, 68, 127, .12)) saturate(.6); opacity: .85; }
.lm-card h3 { margin: 0 0 6px; font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; color: #102552; }
.lm-card p { margin: 0 0 14px; font-size: .9375rem; line-height: 1.5; font-weight: 500; color: #2C3A57; }
.lm-list { list-style: none; margin: 0 0 18px; padding: 0; display: grid; gap: 7px; }
.lm-list li { display: flex; align-items: flex-start; gap: 8px; font-size: .875rem; color: #2C3A57; }
.lm-list svg { flex: 0 0 auto; margin-top: 3px; color: #2F6FCF; }
.lm-link { margin-top: auto; align-self: flex-start; }

@media (max-width: 991px) { .lm-grid { grid-template-columns: 1fr; max-width: 520px; margin-left: auto; margin-right: auto; } }
@media (prefers-reduced-motion: reduce) { .lm-card { transition: none; } .lm-wave, .lm-road__lane, .lm-shimmer, .lm-foam, .lm-reflect, .lm-card__cloud { animation: none; } }
</style>
