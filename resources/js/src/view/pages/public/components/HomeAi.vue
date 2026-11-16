<template>
  <!--
    How F16s uses AI (owner, 2026-11-13), laid out after the owner's Pinterest reference (a "Nowruz components"
    widget board): white widget tiles in three masonry columns, one bold colour tile with a big number, a green arc,
    a dark pill over large grey type, a before → after pair with a looped arrow, small pill tiles.
    Every line is shipped (docs/LANDING_PAGE.md §1a, §2). No assistant name on the page (owner: no "Jev").
  -->
  <section class="lai" aria-labelledby="ai-heading">
    <header class="lp-head">
      <span class="lp-eyebrow">AI in F16s</span>
      <h2 id="ai-heading" class="lp-title">AI does the reading.<br />Your team makes the calls.</h2>
      <p class="lp-sub">AI handles the typing and sorting that eat your day. Nothing reaches a client or an airline until a person checks it.</p>
    </header>

    <div ref="board" class="lai-board" :class="{ 'is-in': shown }">
      <!-- Column 1 -->
      <div class="lai-col">
        <!-- Before → after: the client's papers become the AWB draft -->
        <article class="lai-tile lai-swap">
          <div class="lai-swap__pair">
            <figure>
              <span class="lai-doc lai-doc--peach" aria-hidden="true">
                <i></i><i></i><i class="is-short"></i><i></i><i class="is-short"></i>
              </span>
              <figcaption>Invoice + packing list</figcaption>
            </figure>
            <svg class="lai-swap__arrow" viewBox="0 0 44 30" aria-hidden="true">
              <path d="M3 18 C 10 4, 24 4, 22 14 C 20 22, 12 18, 18 12 C 24 7, 33 9, 40 15" />
              <path d="M35 11 L40 15 L34 18" />
            </svg>
            <figure>
              <span class="lai-doc lai-doc--sky" aria-hidden="true">
                <b>AWB</b><i></i><i class="is-short"></i><i></i><em><b-icon icon="check2"></b-icon></em>
              </span>
              <figcaption>AWB draft</figcaption>
            </figure>
          </div>
        </article>

        <!-- Reads scanned documents, with a scan line passing over a page -->
        <article class="lai-tile lai-scan lai-grow">
          <span class="lai-chip"><b-icon icon="upc-scan" aria-hidden="true"></b-icon></span>
          <h3>Reads your <strong>scanned AWBs</strong>, <strong>BLs</strong> and <strong>delivery orders</strong></h3>
          <div class="lai-scan__art" aria-hidden="true">
            <span class="lai-scan__page">
              <i></i><i class="is-short"></i><i></i><i></i><i class="is-short"></i>
              <span class="lai-scan__beam"></span>
            </span>
            <span class="lai-shadow"></span>
          </div>
          <p class="lai-foot">Into the job. Nobody retypes them.</p>
        </article>

      </div>

      <!-- Column 2 -->
      <div class="lai-col">
        <!-- The bold tile: how long a draft takes -->
        <article class="lai-tile lai-number">
          <strong class="lai-number__big">10–{{ upper }}</strong>
          <span class="lai-number__rule" aria-hidden="true"></span>
          <span class="lai-number__side">
            <span class="lai-number__tag">seconds</span>
            <span class="lai-number__label">an invoice to a draft</span>
          </span>
        </article>

        <!-- The inbox, under a green arc -->
        <article class="lai-tile lai-arc lai-grow">
          <span class="lai-arc__glow" aria-hidden="true"></span>
          <span class="lai-arc__icon"><b-icon icon="envelope-open" aria-hidden="true"></b-icon></span>
          <h3>Your inbox, <strong>sorted</strong><br />every <strong>2 minutes</strong></h3>
          <span class="lai-tag">Lane · cargo · import or export</span>
        </article>

        <!-- Client updates: big grey words, a dark pill on top -->
        <article class="lai-tile lai-draft">
          <span class="lai-draft__words" aria-hidden="true">Ready<br />to send.</span>
          <span class="lai-draft__pill">
            <span class="lai-draft__dot" aria-hidden="true"></span>
            Client update drafted
            <span class="lai-draft__send">You send <b-icon icon="arrow-right" aria-hidden="true"></b-icon></span>
          </span>
        </article>
      </div>

      <!-- Column 3 -->
      <div class="lai-col">
        <!-- Asks before it spends: the coin -->
        <article class="lai-tile lai-coin">
          <span class="lai-chip"><b-icon icon="coin" aria-hidden="true"></b-icon></span>
          <h3>Asks <strong>before it spends</strong><br />a credit on a scan</h3>
          <div class="lai-coin__art" aria-hidden="true">
            <span class="lai-coin__face"></span>
            <span class="lai-shadow"></span>
          </div>
          <p class="lai-foot">Every scan waits for a yes.</p>
        </article>

        <!-- Emails drafted for you (owner, 2026-11-13): no blank page to open a conversation, no retyping to report
             each stage. The list cycles through a shipment's mails, each "typed" in turn. -->
        <article class="lai-tile lai-mail lai-grow">
          <span class="lai-chip"><b-icon icon="envelope" aria-hidden="true"></b-icon></span>
          <h3><strong>Emails drafted</strong> for you</h3>
          <p class="lai-mail__sub">No blank page to start a conversation, and no retyping to tell a client where the cargo is.</p>
          <ul class="lai-mail__list" aria-label="Examples of drafted mails">
            <li v-for="(mail, i) in mails" :key="mail.stage" :class="{ 'is-on': i === mailIndex, 'is-done': i < mailIndex }">
              <span class="lai-mail__stage" :class="'is-' + mail.tone">{{ mail.stage }}</span>
              <span class="lai-mail__subject">{{ mail.subject }}</span>
              <b-icon class="lai-mail__tick" icon="check2" aria-hidden="true"></b-icon>
            </li>
          </ul>
          <p class="lai-foot">Drafted from the job. Your team reads it and sends.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
// A shipment's mails, from the first quote to delivery (the stages F16s already tracks; docs/LANDING_PAGE.md §1a).
const MAILS = [
  { stage: "Quote", tone: "violet", subject: "Rates for 2 pallets, BOM → DXB" },
  { stage: "Booked", tone: "sky", subject: "Your booking is confirmed" },
  { stage: "Departed", tone: "peach", subject: "Your cargo is in the air" },
  { stage: "Arrived", tone: "mint", subject: "Arrived at Dubai, clearing now" },
  { stage: "Delivered", tone: "butter", subject: "Delivered. Here is your POD" },
];

export default {
  name: "HomeAi",
  data: () => ({ shown: false, upper: 10, mails: MAILS, mailIndex: 0 }),
  mounted() {
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      this.shown = true;
      this.upper = 18;
      return;
    }
    // Play once the top of the board is in the window, or already above it: a fast scroll or a jump that skips past
    // the board must not leave the tiles invisible. Checked on every scroll (capture: the page scrolls inside the
    // layout, not the window), so a jump is caught too.
    this.check = () => {
      if (this.shown || !this.$refs.board) return;
      if (this.$refs.board.getBoundingClientRect().top > window.innerHeight * 0.85) return;
      this.shown = true;
      window.removeEventListener("scroll", this.check, true);
      this.countUp();
      this.timer = setInterval(() => { this.mailIndex = (this.mailIndex + 1) % MAILS.length; }, 2200);
    };
    window.addEventListener("scroll", this.check, { capture: true, passive: true });
    this.check();
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.check, true);
    clearInterval(this.timer);
    clearInterval(this.counter);
  },
  methods: {
    countUp() {
      // 10 → 18 once, after the tiles have landed.
      setTimeout(() => {
        this.counter = setInterval(() => {
          if (this.upper >= 18) return clearInterval(this.counter);
          this.upper += 1;
        }, 70);
      }, 500);
    },
  },
};
</script>

<style>
.lai { --lai-ink: #1B2440; --lai-soft: #6B7A93; --lai-blue: #3E8BEA; padding: 72px 0 40px; font-family: "Inter", sans-serif; }

/* Three masonry columns; in each, one tile (.lai-grow) stretches so the bottoms line up, as in the reference. */
.lai-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; max-width: 1040px; margin: 44px auto 0; }
.lai-col { display: flex; flex-direction: column; gap: 18px; }
.lai-grow { flex: 1 1 auto; }

.lai-tile {
  position: relative; overflow: hidden; border-radius: 34px; background: #fff; text-align: center; color: var(--lai-ink);
  box-shadow: 0 1px 2px rgba(27, 36, 64, .04), 0 12px 32px rgba(38, 68, 127, .06);
}
.lai-tile h3 { margin: 0; font-size: 1.25rem; line-height: 1.3; font-weight: 400; letter-spacing: -.02em; color: var(--lai-ink); }
.lai-tile h3 strong { font-weight: 700; }
.lai-chip { display: inline-grid; place-items: center; width: 36px; height: 36px; margin-bottom: 14px; border-radius: 50%; background: #F1F3F7; color: var(--lai-ink); font-size: 1rem; }
.lai-foot { margin: 0; font-size: .8125rem; color: var(--lai-soft); }
.lai-shadow { display: block; width: 60%; height: 10px; margin: 10px auto 0; border-radius: 50%; background: radial-gradient(closest-side, rgba(27, 36, 64, .12), transparent); }

/* Before → after */
.lai-swap { padding: 26px 20px 20px; }
.lai-swap__pair { display: flex; align-items: center; justify-content: center; gap: 8px; }
.lai-swap figure { margin: 0; display: grid; justify-items: center; gap: 10px; }
.lai-swap figcaption { font-size: .8125rem; font-weight: 500; color: var(--lai-ink); }
.lai-swap__arrow { width: 40px; flex: 0 0 auto; margin-bottom: 26px; fill: none; stroke: var(--lai-ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.lai-doc {
  position: relative; display: flex; flex-direction: column; justify-content: center; gap: 6px;
  width: 92px; height: 92px; padding: 14px; border-radius: 22px;
}
.lai-doc i { display: block; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, .85); }
.lai-doc i.is-short { width: 60%; }
.lai-doc b { font-size: .6875rem; font-weight: 800; letter-spacing: .08em; color: #fff; text-align: left; }
.lai-doc em { position: absolute; right: 8px; bottom: 8px; display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; background: #fff; color: #13865A; font-style: normal; font-size: .8125rem; }
.lai-doc--peach { background: linear-gradient(160deg, #FBCDB3, #F6A98A); }
.lai-doc--sky { background: linear-gradient(160deg, #9CC6F7, #5C9DED); }

/* The bold tile */
.lai-number {
  display: flex; align-items: center; gap: 22px; padding: 26px 28px; text-align: left; color: #fff;
  background: linear-gradient(135deg, #5C9DED, #3E8BEA 60%, #2F6FCF);
  box-shadow: 0 16px 36px rgba(62, 139, 234, .28);
}
.lai-number__big { font-size: 3rem; line-height: 1; font-weight: 800; letter-spacing: -.04em; text-shadow: 0 2px 0 rgba(0, 0, 0, .08); }
.lai-number__rule { align-self: stretch; width: 1px; background: rgba(255, 255, 255, .3); }
.lai-number__side { display: grid; gap: 8px; justify-items: start; }
.lai-number__tag { padding: 4px 12px; border-radius: 999px; background: rgba(15, 50, 120, .35); font-size: .75rem; font-weight: 600; }
.lai-number__label { font-size: 1rem; font-weight: 500; line-height: 1.25; }

/* The green arc */
.lai-arc { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 14px; padding: 96px 22px 26px; min-height: 250px; }
.lai-arc__glow {
  position: absolute; left: -20%; right: -20%; top: -150px; height: 240px; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 100%, rgba(52, 199, 89, .75) 0%, rgba(52, 199, 89, .25) 32%, rgba(255, 255, 255, 0) 62%);
  border-bottom: 2px solid rgba(52, 199, 89, .55);
}
.lai-arc__icon { position: absolute; top: 34px; left: 50%; transform: translateX(-50%); color: #fff; font-size: 1.25rem; }
.lai-tag { padding: 5px 14px; border-radius: 999px; background: #E6F7EC; color: #1E8A4C; font-size: .75rem; font-weight: 600; transform: rotate(-2deg); }

/* Big grey words, a dark pill over them */
.lai-draft { display: grid; place-items: center; min-height: 200px; padding: 18px; }
.lai-draft__words { font-size: 3.4rem; line-height: 1.32; font-weight: 600; letter-spacing: -.045em; color: #BCC3CF; }
.lai-draft__pill {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  display: inline-flex; align-items: center; gap: 10px; white-space: nowrap;
  padding: 12px 12px 12px 18px; border-radius: 16px; background: #23262E; color: #fff;
  font-size: .875rem; font-weight: 600; box-shadow: 0 14px 30px rgba(20, 24, 36, .35);
}
.lai-draft__dot { width: 8px; height: 8px; border-radius: 50%; background: #F5B83D; box-shadow: 0 0 0 4px rgba(245, 184, 61, .2); }
.lai-draft__send { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 10px; background: var(--lai-blue); font-size: .75rem; }

/* Scan */
.lai-scan, .lai-coin { display: flex; flex-direction: column; align-items: center; padding: 26px 22px 24px; }
.lai-scan__art, .lai-coin__art { flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 22px 0 14px; }
.lai-scan__page {
  position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 9px;
  width: 120px; height: 150px; padding: 18px; border-radius: 16px; background: #F4F7FC; border: 1px solid #E3E9F3;
}
.lai-scan__page i { display: block; height: 7px; border-radius: 4px; background: #D5DDEA; }
.lai-scan__page i.is-short { width: 55%; }
.lai-scan__beam {
  position: absolute; left: 0; right: 0; top: 0; height: 36px;
  background: linear-gradient(180deg, rgba(62, 139, 234, 0), rgba(62, 139, 234, .28));
  border-bottom: 2px solid var(--lai-blue);
  animation: lai-scan 2.6s ease-in-out infinite;
}
@keyframes lai-scan { 0%, 100% { transform: translateY(-36px); } 50% { transform: translateY(150px); } }

/* Coin */
.lai-coin__face {
  position: relative; width: 104px; height: 104px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #FFE680 0%, #F7C629 45%, #E0A10E 100%);
  box-shadow: inset 0 0 0 7px rgba(255, 255, 255, .25), inset 0 -6px 12px rgba(160, 100, 0, .25);
  animation: lai-float 3.2s ease-in-out infinite;
}
.lai-coin__face::after {
  content: ""; position: absolute; inset: 18px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, .45);
  background: linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, .45) 48%, transparent 56%);
}
@keyframes lai-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* Emails drafted for you */
.lai-mail { display: flex; flex-direction: column; align-items: center; padding: 26px 20px 22px; }
.lai-mail__sub { margin: 8px 0 18px; max-width: 260px; font-size: .875rem; line-height: 1.5; color: var(--lai-soft); }
.lai-mail__list { flex: 1 1 auto; width: 100%; margin: 0 0 16px; padding: 0; list-style: none; display: grid; gap: 8px; align-content: center; }
.lai-mail__list li {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; background: #F4F6FA; text-align: left;
  transition: background .35s ease, box-shadow .35s ease, transform .35s cubic-bezier(.34, 1.56, .64, 1), opacity .35s ease;
  opacity: .55;
}
.lai-mail__list li.is-done { opacity: .8; }
.lai-mail__list li.is-on { opacity: 1; background: #fff; transform: scale(1.04); box-shadow: 0 10px 24px rgba(38, 68, 127, .14); }
.lai-mail__stage { flex: 0 0 auto; padding: 3px 9px; border-radius: 999px; font-size: .6875rem; font-weight: 700; }
.lai-mail__stage.is-violet { background: #EDE9FE; color: #6D28D9; }
.lai-mail__stage.is-sky { background: #E3EFFD; color: #2F6FCF; }
.lai-mail__stage.is-peach { background: #FDE8DC; color: #B4532A; }
.lai-mail__stage.is-mint { background: #DCF5E7; color: #137A47; }
.lai-mail__stage.is-butter { background: #FCF1CF; color: #946200; }
.lai-mail__subject { flex: 0 1 auto; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: .8125rem; font-weight: 500; color: var(--lai-ink); }
/* The live one "types" its subject, then a caret blinks. */
.lai-mail__list li.is-on .lai-mail__subject { text-overflow: clip; animation: lai-type 1.1s steps(28, end) both; border-right: 2px solid var(--lai-blue); padding-right: 2px; }
@keyframes lai-type { from { max-width: 0; } to { max-width: 100%; } }
.lai-mail__tick { flex: 0 0 auto; margin-left: auto; color: #13865A; opacity: 0; transition: opacity .3s ease; }
.lai-mail__list li.is-done .lai-mail__tick { opacity: 1; }

/* ── Motion, after the reference: the tiles spring in one by one, then each keeps a small loop going ── */
.lai-board .lai-tile { opacity: 0; transform: translateY(26px) scale(.94); }
.lai-board.is-in .lai-tile { animation: lai-pop .8s cubic-bezier(.34, 1.56, .64, 1) both; }
.lai-board.is-in .lai-col:nth-child(1) .lai-tile:nth-child(1) { animation-delay: 0s; }
.lai-board.is-in .lai-col:nth-child(2) .lai-tile:nth-child(1) { animation-delay: .08s; }
.lai-board.is-in .lai-col:nth-child(3) .lai-tile:nth-child(1) { animation-delay: .16s; }
.lai-board.is-in .lai-col:nth-child(1) .lai-tile:nth-child(2) { animation-delay: .24s; }
.lai-board.is-in .lai-col:nth-child(2) .lai-tile:nth-child(2) { animation-delay: .32s; }
.lai-board.is-in .lai-col:nth-child(3) .lai-tile:nth-child(2) { animation-delay: .4s; }
.lai-board.is-in .lai-col:nth-child(2) .lai-tile:nth-child(3) { animation-delay: .48s; }
@keyframes lai-pop { from { opacity: 0; transform: translateY(26px) scale(.94); } to { opacity: 1; transform: none; } }

/* Before → after: the arrow draws itself, the AWB pops, then the pair keeps swapping emphasis. */
.lai-swap__arrow path { stroke-dasharray: 90; stroke-dashoffset: 90; }
.lai-board.is-in .lai-swap__arrow path { animation: lai-draw 3.6s ease-in-out .5s infinite; }
@keyframes lai-draw { 0% { stroke-dashoffset: 90; } 30%, 80% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -90; } }
.lai-board.is-in .lai-doc--sky { animation: lai-awb 3.6s cubic-bezier(.34, 1.56, .64, 1) .5s infinite; }
@keyframes lai-awb { 0%, 25% { transform: scale(.86) rotate(-4deg); opacity: .5; } 40%, 85% { transform: none; opacity: 1; } 100% { transform: scale(.86) rotate(-4deg); opacity: .5; } }
.lai-board.is-in .lai-doc--peach { animation: lai-src 3.6s ease-in-out .5s infinite; }
@keyframes lai-src { 0%, 20% { transform: translateY(-4px) rotate(3deg); } 40%, 100% { transform: none; } }

/* The green arc rises into place; the envelope bobs under it. */
.lai-arc__glow { transform-origin: 50% 0; }
.lai-board.is-in .lai-arc__glow { animation: lai-rise 1.2s cubic-bezier(.22, 1, .36, 1) .4s both; }
@keyframes lai-rise { from { transform: scaleY(.3); opacity: 0; } to { transform: none; opacity: 1; } }
.lai-board.is-in .lai-arc__icon { animation: lai-bob 2.4s ease-in-out 1.2s infinite; }
@keyframes lai-bob { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, -5px); } }
.lai-board.is-in .lai-tag { animation: lai-wobble 3s ease-in-out 1.4s infinite; }
@keyframes lai-wobble { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }

/* The dark pill slides up over the grey words; its dot pulses. */
.lai-board.is-in .lai-draft__pill { animation: lai-slide .9s cubic-bezier(.34, 1.56, .64, 1) .9s both; }
@keyframes lai-slide { from { opacity: 0; transform: translate(-50%, 40%) scale(.9); } to { opacity: 1; transform: translate(-50%, -50%); } }
.lai-draft__dot { animation: lai-pulse 1.6s ease-in-out infinite; }
@keyframes lai-pulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(245, 184, 61, .2); } 50% { box-shadow: 0 0 0 8px rgba(245, 184, 61, 0); } }

/* The coin flips now and then instead of floating. */
.lai-coin__art { perspective: 600px; }
.lai-coin__face { animation: lai-flip 4s cubic-bezier(.45, 0, .2, 1) 1s infinite; }
@keyframes lai-flip { 0%, 55% { transform: rotateY(0) translateY(0); } 70% { transform: rotateY(180deg) translateY(-14px); } 85%, 100% { transform: rotateY(360deg) translateY(0); } }

/* The bold tile's number lands with a small bounce once counted. */
.lai-number__big { display: inline-block; white-space: nowrap; font-variant-numeric: tabular-nums; }

@media (max-width: 991px) {
  .lai-board { grid-template-columns: repeat(2, 1fr); }
  .lai-col:nth-child(3) { grid-column: 1 / -1; display: grid; grid-template-columns: 1fr 1fr; }
}
@media (max-width: 575px) {
  .lai-board { grid-template-columns: 1fr; }
  .lai-col:nth-child(3) { display: flex; }
  .lai-number__big { font-size: 2.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .lai-board .lai-tile, .lai-board.is-in .lai-tile { opacity: 1; transform: none; animation: none; }
  .lai-board *, .lai-board *::after { animation: none !important; }
  .lai-swap__arrow path { stroke-dashoffset: 0; }
}
</style>
