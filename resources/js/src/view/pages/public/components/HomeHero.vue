<template>
  <!--
    The landing hero (redesign, 2026-11-12; second pass the same day after the owner's "Get early access" reference):
    one rounded blue card, everything centred — an eyebrow pill, the promise in big white type, two buttons, then the
    product itself: a hand holding a laptop that shows the Operational Board, sinking into the blue, with frosted
    proof cards across its foot. The board on the screen is HTML (HomeBoardScreen) laid over the photo's green screen,
    so it stays crisp and follows the real board.

    The owner asked for the reference's colours, not the site's old navy/lavender ones.
  -->
  <section class="lh" aria-labelledby="hero-heading">
    <div class="lh-card">
      <div class="lh-glow" aria-hidden="true">
        <span class="lh-cloud lh-cloud--1"></span>
        <span class="lh-cloud lh-cloud--2"></span>
        <span class="lh-cloud lh-cloud--3"></span>
        <!-- The F16s jet crosses the sky behind the title on a faint contrail (2026-11-16): the page opens with the
             jet it closes with (HomeCta.vue). -->
        <svg class="lh-flight" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMin slice">
          <defs>
            <symbol id="lh-jet" viewBox="0 0 24 24">
              <path d="M12 1.2 C12.9 2.3 13.3 4 13.3 6.2 V9.4 L21.2 14.4 V16.3 L13.3 13.9 L13.1 18.1 L16.2 20.4 V21.9 L12 20.9 L7.8 21.9 V20.4 L10.9 18.1 L10.7 13.9 L2.8 16.3 V14.4 L10.7 9.4 V6.2 C10.7 4 11.1 2.3 12 1.2 Z" />
            </symbol>
            <linearGradient id="lh-trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#fff" stop-opacity="0" /><stop offset="1" stop-color="#fff" stop-opacity=".8" />
            </linearGradient>
          </defs>
          <path id="lh-route" d="M-80 128 C260 66 560 70 760 84 S1060 104 1280 60" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round" />
          <path class="lh-contrail" d="M-80 128 C260 66 560 70 760 84 S1060 104 1280 60" fill="none" stroke="url(#lh-trail)" stroke-width="3" stroke-linecap="round" pathLength="1" />
          <g class="lh-jet" fill="#fff">
            <animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#lh-route" /></animateMotion>
            <use href="#lh-jet" x="-17" y="-17" width="34" height="34" transform="rotate(90)" />
          </g>
        </svg>
      </div>

      <div class="lh-copy">
        <span class="lh-eyebrow">Freight forwarding, made clear</span>
        <!-- New promise (owner chose "the board comes alive", 2026-11-16). The old sub-line's "under 3 seconds" and
             "150+ airlines" had nothing behind them (docs/LANDING_PAGE.md §4); every phrase here is shipped. -->
        <h1 id="hero-heading" class="lh-title">Every shipment,<br />on one clear board.</h1>
        <p class="lh-sub">
          Client mails read every 2 minutes, waybills drafted by AI, and e-AWBs sent straight to the airlines.
          Air and sea, for your whole team.
        </p>
        <div class="lh-ctas">
          <lp-button href="#talk-to-us" icon="arrow-right" @click="toForm">Get started</lp-button>
          <lp-button to="/product-description" variant="ghost">See how it works</lp-button>
        </div>
        <ul class="lh-works" aria-label="Works with">
          <li><b-icon icon="cursor" aria-hidden="true"></b-icon>Air</li>
          <li><b-icon icon="water" aria-hidden="true"></b-icon>Sea</li>
          <li><b-icon icon="envelope" aria-hidden="true"></b-icon>Outlook &amp; Microsoft 365</li>
        </ul>
      </div>

      <div class="lh-stage">
        <div class="lh-device">
          <img
            class="lh-photo"
            src="/media/assets/banners/hero-laptop.png"
            alt="Hands holding up a laptop showing the F16s Operational Board"
            width="2400"
            height="1350"
            fetchpriority="high"
          />
          <div class="lh-screen"><home-board-screen></home-board-screen></div>
        </div>
        <!-- The stat cards ("3 sec", "150+ airlines"…) went (owner, 2026-11-12): nothing backed them (LANDING_PAGE.md §4). -->
      </div>
    </div>
  </section>
</template>

<script>
import HomeBoardScreen from "./HomeBoardScreen.vue";
import LpButton from "./LpButton.vue";

export default {
  name: "HomeHero",
  components: { HomeBoardScreen, LpButton },
  mounted() {
    this.pin();
    window.addEventListener("resize", this.pin);
    if (window.ResizeObserver) {
      this.observer = new ResizeObserver(() => this.pin());
      this.observer.observe(this.$el);
    }
    // The page scrolls inside the layout, not the window: listen on whichever element scrolls.
    this.scroller = this.scrollParent();
    this.onScroll = () => {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => { this.frame = null; this.parallax(); });
    };
    this.scroller.addEventListener("scroll", this.onScroll, { passive: true });
    this.parallax();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.pin);
    if (this.observer) this.observer.disconnect();
    if (this.scroller) this.scroller.removeEventListener("scroll", this.onScroll);
    if (this.frame) cancelAnimationFrame(this.frame);
  },
  methods: {
    // "Get started" goes to the Talk to us form further down the page.
    toForm(e) {
      if (e && e.preventDefault) e.preventDefault();
      const el = document.getElementById("talk-to-us");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else this.$router.push("/contact-us");
    },
    /**
     * The hero is taller than the window, so it pins by its FOOT: it scrolls normally until its bottom edge reaches the
     * bottom of the window, then stays there while the white sheet slides up over it (owner, 2026-11-12).
     */
    pin() {
      // The site header sits over the top of the card, and its height changes with the width (119–141 px): measure it,
      // so the tag and title always start below it (owner, 2026-11-12: "the tag is hiding behind the top bar").
      // Where the hero would start on its own: below the header, its margin and the page wrapper's padding. Pulled up by
      // exactly that, the card starts at the window's top whatever the header's height.
      // Measured from the hero itself, adding back the pull it already has: its negative margin collapses through the
      // wrapper, so measuring the wrapper read 0 once pulled, then 161, then 0… and the hero flickered (2026-11-13).
      const layout = this.$el.closest(".layout-wrapper");
      // Only at the top of the page: once scrolled, the sticky hero's box has moved and would read wrong.
      const scrolled = this.scroller && (this.scroller === window ? window.scrollY : this.scroller.scrollTop) > 0;
      if (layout && !(scrolled && this.$el.style.getPropertyValue("--lh-head"))) {
        const pulled = parseFloat(getComputedStyle(this.$el).marginTop) || 0;
        const start = this.$el.getBoundingClientRect().top - layout.getBoundingClientRect().top - pulled;
        const head = Math.round(start) + "px";
        if (this.$el.style.getPropertyValue("--lh-head") !== head) this.$el.style.setProperty("--lh-head", head);
      }
      const stick = Math.min(0, window.innerHeight - this.$el.offsetHeight) + "px";
      if (this.$el.style.getPropertyValue("--lh-stick") !== stick) this.$el.style.setProperty("--lh-stick", stick);
    },
    /**
     * Parallax: how far the curved white sheet has risen over the window (0 → 1). The card eases back and dims as it
     * is covered (CSS reads --lh-p), so the sheet reads as a layer in front, not just the next block.
     */
    parallax() {
      const sheet = this.$el.nextElementSibling;
      if (!sheet) return;
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - sheet.getBoundingClientRect().top) / vh));
      this.$el.style.setProperty("--lh-p", p.toFixed(3));
      // Fully covered: hide it. Nobody can see it, and Chrome was painting the pinned hero over the sections further
      // down (the closing call to action showed the laptop instead), 2026-11-12.
      this.$el.style.visibility = p >= 1 ? "hidden" : "";
    },
    scrollParent() {
      for (let el = this.$el.parentElement; el; el = el.parentElement) {
        const y = getComputedStyle(el).overflowY;
        if ((y === "auto" || y === "scroll") && el.scrollHeight > el.clientHeight) return el;
      }
      return window;
    },
  },
};
</script>

<style>
/* ── The card ────────────────────────────────────────────────────────────────────────────────────────────────────
   Inset from the window with rounded corners, and pulled up behind the transparent site header so the logo and the
   nav sit on the blue, as in the reference. */
.layout-wrapper > .wrap { position: relative; z-index: 20; }
/* The page around and under the card is plain white (owner, 2026-11-12). */
.layout-wrapper:has(.lh) { background: #fff !important; }

/* While the hero is on the page, the header sits on the blue: white nav pill, white buttons (as in the reference). */
@media (min-width: 992px) {
  .layout-wrapper:has(.lh) .wrap .nav-menu { background: rgba(255, 255, 255, .16) !important; border-color: rgba(255, 255, 255, .35) !important; box-shadow: none !important; }
  .layout-wrapper:has(.lh) .wrap .nav-menu .nav-link { color: #fff !important; }
  .layout-wrapper:has(.lh) .wrap .nav-menu .nav-link:hover { color: rgba(255, 255, 255, .8) !important; }
  .layout-wrapper:has(.lh) .wrap .sign-in-btn { border-color: rgba(255, 255, 255, .7) !important; color: #fff !important; }
  .layout-wrapper:has(.lh) .wrap .sign-in-btn:hover { background: rgba(255, 255, 255, .14) !important; }
  .layout-wrapper:has(.lh) .wrap .whats-new-btn { background: #fff !important; color: #3E8BEA !important; }
  .layout-wrapper:has(.lh) .wrap .whats-new-btn:hover { box-shadow: 0 6px 18px rgba(20, 60, 140, .25) !important; }
}
.lh {
  /* Lighter blues (owner: "too dark, make it lighter blue"), on a white page. */
  --lh-blue-top: #6FA9F2;
  --lh-blue-mid: #9CC6F7;
  --lh-blue-low: #CFE4FC;
  /* Sticky: the white sheet after it (Home.vue .lp-sheet) scrolls up over it. --lh-stick is set in pin(). */
  position: sticky; top: var(--lh-stick, 0px); z-index: 0;
  margin-top: calc(-1 * var(--lh-head, 170px)); padding: 14px 14px 0;
  font-family: "Inter", sans-serif;
}
.lh-card {
  /* clip, not hidden: a hidden box can still be scrolled (focus, scrollIntoView), which slid the tag under the header. */
  position: relative; isolation: isolate; overflow: clip;
  padding: calc(var(--lh-head, 170px) + 30px) 24px 56px; border-radius: 36px;
  background: linear-gradient(180deg, var(--lh-blue-top) 0%, var(--lh-blue-mid) 45%, var(--lh-blue-low) 100%);
  text-align: center; color: #fff;
  /* Parallax as the white sheet rises over it (--lh-p 0 → 1, set in parallax()): the card eases back and dims. */
  transform: scale(calc(1 - .06 * var(--lh-p, 0))); transform-origin: 50% 100%;
  will-change: transform;
}
.lh-card::after {
  content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none;
  background: rgba(22, 52, 112, .38); opacity: var(--lh-p, 0);
}
/* …and its contents drift up a little slower than the page, the depth cue. */
.lh-copy, .lh-stage { transform: translateY(calc(var(--lh-p, 0) * -70px)); }

/* Soft light in the blue: a bright haze behind the title and the laptop, a few faint clouds. */
.lh-glow { position: absolute; inset: 0; z-index: -1; pointer-events: none; }
.lh-glow::before {
  content: ""; position: absolute; left: 50%; top: 38%; width: 1100px; height: 900px; margin-left: -550px;
  background: radial-gradient(closest-side, rgba(255, 255, 255, .38), rgba(255, 255, 255, 0));
}
.lh-cloud {
  position: absolute; border-radius: 50%; background: #fff; filter: blur(40px); opacity: .28;
  animation: lh-drift 60s ease-in-out infinite alternate;
}
.lh-cloud--1 { width: 520px; height: 140px; top: 90px; left: -160px; }
.lh-cloud--2 { width: 460px; height: 120px; top: 260px; right: -140px; animation-duration: 80s; }
.lh-cloud--3 { width: 1000px; height: 220px; bottom: -60px; left: 50%; margin-left: -500px; opacity: .45; animation: none; }
@keyframes lh-drift { from { transform: translateX(0); } to { transform: translateX(70px); } }

/* ── Copy, centred ───────────────────────────────────────────────────────────────────────────────────────────── */
.lh-copy { position: relative; max-width: 820px; margin: 0 auto; }
.lh-eyebrow {
  display: inline-block; padding: 7px 16px; border-radius: 999px;
  background: rgba(255, 255, 255, .18); border: 1px solid rgba(255, 255, 255, .35); backdrop-filter: blur(8px);
  font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
}
.lh-title {
  margin: 22px 0 18px; color: #fff;
  font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.02; font-weight: 600; letter-spacing: -.04em;
  /* A firmer shadow keeps white type readable on the lighter blue. */
  text-shadow: 0 2px 18px rgba(30, 80, 160, .28);
}
.lh-sub {
  margin: 0 auto 30px; max-width: 520px; font-size: 1.0625rem; line-height: 1.6; font-weight: 500; color: #fff;
  text-shadow: 0 1px 10px rgba(30, 80, 160, .3);
}
.lh-ctas { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
/* Buttons: LpButton.vue (the hero's style is the site's button, 2026-11-16). */

/* Works with: a quiet line under the buttons. */
.lh-works { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 22px; list-style: none; margin: 26px 0 0; padding: 0; }
.lh-works li { display: inline-flex; align-items: center; gap: 7px; font-size: .8125rem; font-weight: 600; color: rgba(255, 255, 255, .92); text-shadow: 0 1px 8px rgba(30, 80, 160, .3); }
.lh-works svg { opacity: .85; }

/* The jet crossing the sky, behind everything. */
.lh-flight { position: absolute; left: 0; top: 0; width: 100%; height: 60%; overflow: visible; }
.lh-contrail { stroke-dasharray: 1; stroke-dashoffset: 1; animation: lh-trail 14s linear infinite; }
@keyframes lh-trail { 0% { stroke-dashoffset: 1; opacity: .9; } 85% { stroke-dashoffset: 0; opacity: .9; } 100% { stroke-dashoffset: 0; opacity: 0; } }
.lh-jet { opacity: .95; }


/* ── The laptop ──────────────────────────────────────────────────────────────────────────────────────────────
   "Hands hold up an open laptop with a blank screen", photo by Lorin Both on Unsplash (free under the Unsplash
   License): https://unsplash.com/photos/8IkP2_AEsDU — background keyed out and the silhouette tinted navy #26447F
   (no black, owner 2026-11-11). 2400 × 1350; the white screen sits at these fractions of it (measured on the file).
   The hands show in full (owner, 2026-11-12); only the forearms fade out, behind the stat cards. */
.lh-stage { position: relative; max-width: 1300px; margin: -10px auto 0; }
.lh-device {
  --scr-left: 27.46%; --scr-top: 14.15%; --scr-width: 41.33%; --scr-height: 50.67%;
  position: relative; width: 100%; aspect-ratio: 2400 / 1350; margin-bottom: -11%;
  -webkit-mask-image: linear-gradient(180deg, #000 80%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 80%, transparent 100%);
}
.lh-photo { display: block; width: 100%; height: 100%; object-fit: contain; }
.lh-screen {
  position: absolute; left: var(--scr-left); top: var(--scr-top); width: var(--scr-width); height: var(--scr-height);
  border-radius: 1.6% / 2.3%; overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .lh-cloud { animation: none; }
  .lh-jet { display: none; }
  .lh-contrail { animation: none; stroke-dashoffset: 0; opacity: .5; }
  .lh-card, .lh-copy, .lh-stage { transform: none; }
}

/* ── Tablet / phone ─────────────────────────────────────────────────────────────────────────────────────────── */
@media (max-width: 991px) {
  .lh-card { border-radius: 28px; }
  .lh-device { width: 150%; margin-left: -25%; margin-bottom: -4%; }
}
@media (max-width: 575px) {
  .lh { padding: 8px 8px 0; }
  .lh-card { padding: calc(var(--lh-head, 130px) + 20px) 16px 24px; border-radius: 24px; }
  .lh-title { font-size: 2.375rem; }
  .lh-sub { font-size: 1rem; }
  .lh-device { width: 200%; margin-left: -50%; }
}
</style>
