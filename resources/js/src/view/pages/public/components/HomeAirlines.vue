<template>
  <!--
    Airlines (landing redesign, 2026-11-12), in place of the "Global Airline Affiliations" ticker strip.

    🔴 HONEST FRAMING: F16s is not affiliated with these airlines. e-AWBs go out as Cargo-XML through the Descartes
    network, which reaches them (ConversionController.php). So the section says your waybills reach the airlines you
    fly with, and names Descartes — no "affiliations", no airline count (docs/LANDING_PAGE.md §4).
  -->
  <section class="la" aria-labelledby="airlines-heading">
    <div class="la-panel">
      <header class="lp-head">
        <span class="lp-eyebrow">Airlines</span>
        <h2 id="airlines-heading" class="lp-title">Your AWBs reach the airlines<br />you already fly with.</h2>
        <p class="lp-sub">e-AWBs go out as Cargo-XML through the Descartes network, and every accept or reject comes back to the waybill.</p>
      </header>

      <!-- Two rows drifting opposite ways; hover pauses them. The list is doubled so the loop has no seam. -->
      <div class="la-rows" aria-label="Airlines">
        <div v-for="(row, r) in rows" :key="r" class="la-row" :class="{ 'is-reverse': r === 1 }">
          <div class="la-track">
            <span v-for="(a, i) in row.concat(row)" :key="r + '-' + i" class="la-tile" :aria-hidden="i >= row.length ? 'true' : null">
              <img :src="a.logo" :alt="i >= row.length ? '' : a.name" loading="lazy" :class="a.fit" />
            </span>
          </div>
        </div>
      </div>

      <div class="la-proof">
        <span><b-icon icon="check2-circle" aria-hidden="true"></b-icon> FWB and FHL sent as Cargo-XML</span>
        <span><b-icon icon="check2-circle" aria-hidden="true"></b-icon> Accepted / rejected replies on the AWB</span>
        <span><b-icon icon="check2-circle" aria-hidden="true"></b-icon> Status from cargo accepted to delivered</span>
      </div>
    </div>
  </section>
</template>

<script>
const AIRLINES = [
  { name: "Air France", logo: "/media/assets/carriers/air-france.png", fit: "is-wide" },
  { name: "Emirates", logo: "/media/assets/carriers/emirates.png" },
  { name: "Lufthansa", logo: "/media/assets/carriers/lufthansa.png", fit: "is-wide" },
  { name: "Qatar Airways", logo: "/media/assets/carriers/qatar.png", fit: "is-wide" },
  { name: "Turkish Airlines", logo: "/media/assets/carriers/turkish-airlines.png", fit: "is-wide" },
  { name: "Etihad Airways", logo: "/media/assets/carriers/Etihad-airways-logo.png", fit: "is-wide" },
  { name: "Air India", logo: "/media/assets/carriers/air-india.jpg", fit: "is-wide" },
  { name: "KLM", logo: "/media/assets/carriers/klm.png" },
  // Added 2026-11-13, from Wikimedia Commons (owner: "find more logos of the airlines").
  { name: "Singapore Airlines", logo: "/media/assets/carriers/singapore-airlines.png", fit: "is-wide" },
  { name: "Cathay Pacific", logo: "/media/assets/carriers/cathay-pacific.png", fit: "is-wide" },
  { name: "British Airways", logo: "/media/assets/carriers/british-airways.png", fit: "is-wide" },
  { name: "Saudia", logo: "/media/assets/carriers/saudia.png" },
  { name: "Ethiopian Airlines", logo: "/media/assets/carriers/ethiopian.png" },
  { name: "Korean Air Cargo", logo: "/media/assets/carriers/korean-air-cargo.png", fit: "is-wide" },
  { name: "Thai Airways", logo: "/media/assets/carriers/thai-airways.png", fit: "is-wide" },
  { name: "Gulf Air", logo: "/media/assets/carriers/gulf-air.png", fit: "is-wide" },
  { name: "IndiGo", logo: "/media/assets/carriers/indigo.png", fit: "is-wide" },
  { name: "Kuwait Airways", logo: "/media/assets/carriers/kuwait-airways.png" },
];

// Two rows of nine, mixed so neither row is all Gulf or all European. Each row is wider than the page, so the
// template's doubling alone makes the loop seamless.
const ROW_A = [0, 8, 1, 9, 2, 10, 3, 11, 4].map((i) => AIRLINES[i]);
const ROW_B = [5, 12, 6, 13, 7, 14, 15, 16, 17].map((i) => AIRLINES[i]);

export default {
  name: "HomeAirlines",
  data: () => ({ rows: [ROW_A, ROW_B] }),
};
</script>

<style>
.la { padding: 24px 0 56px; font-family: "Inter", sans-serif; }
/* Straight on the sheet, no card around it (owner, 2026-11-13). */
.la-panel { position: relative; padding: 48px 0 24px; }

.la-rows {
  display: grid; gap: 14px; margin-top: 40px;
  /* Fade the tiles in and out at the edges. */
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 12%, #000 88%, transparent 100%);
}
.la-row { overflow: hidden; }
.la-track { display: flex; gap: 14px; width: max-content; animation: la-scroll 40s linear infinite; }
.la-row.is-reverse .la-track { animation-direction: reverse; animation-duration: 46s; }
.la-rows:hover .la-track { animation-play-state: paused; }
@keyframes la-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.la-tile {
  flex: 0 0 auto; width: 184px; height: 88px; display: grid; place-items: center; padding: 0 22px;
  border-radius: 20px; background: rgba(255, 255, 255, .9); box-shadow: 0 8px 24px rgba(38, 68, 127, .07);
}
.la-tile img { max-width: 100%; max-height: 54px; object-fit: contain; filter: grayscale(1) contrast(1.2); opacity: .85; transition: filter .25s ease, opacity .25s ease; }
.la-tile img.is-wide { max-height: 40px; }
.la-tile:hover img { filter: none; opacity: 1; }

.la-proof { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 24px; margin-top: 32px; padding: 0 24px; font-size: .875rem; font-weight: 500; color: #3F4F6E; }
.la-proof span { display: inline-flex; align-items: center; gap: 7px; }
.la-proof svg { color: #13865A; }

@media (max-width: 767px) {
  .la-panel { padding: 32px 0 16px; }
  .la-tile { width: 140px; height: 70px; border-radius: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .la-track { animation: none; flex-wrap: wrap; justify-content: center; width: auto; }
  .la-rows { -webkit-mask-image: none; mask-image: none; }
}
</style>
