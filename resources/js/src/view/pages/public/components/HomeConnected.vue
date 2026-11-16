<template>
  <!--
    How everything is connected (owner, 2026-11-13). Steps along a winding line (owner, 2026-11-13).
    The chain is the product's own story: client email → enquiry → shipment → documents → invoice → ledger
    (docs/plan/PRD.md:47; docs/LANDING_PAGE.md §1, §2).
  -->
  <section class="lcn" aria-labelledby="connected-heading">
    <header class="lp-head">
      <span class="lp-eyebrow">How it connects</span>
      <h2 id="connected-heading" class="lp-title">One record, from the first mail<br />to the last rupee.</h2>
      <p class="lp-sub">Each step picks up where the last one stopped. Details are typed once and carry on through to the books.</p>
    </header>

    <!-- The steps sit along one winding road: row one runs left to right, row two comes back right to left.
         The line is drawn from the cards' real positions, so it follows whatever layout the screen gives. -->
    <div ref="flow" class="lcn-road">
      <svg class="lcn-line" :width="box.w" :height="box.h" :viewBox="`0 0 ${box.w} ${box.h}`" aria-hidden="true">
        <path class="lcn-line__glow" :d="route" />
        <path id="lcn-route" class="lcn-line__dash" :d="route" />
        <circle v-if="route" class="lcn-runner" r="6"><animateMotion dur="16s" repeatCount="indefinite"><mpath href="#lcn-route" /></animateMotion></circle>
        <circle v-if="route" class="lcn-runner" r="6"><animateMotion dur="16s" begin="-8s" repeatCount="indefinite"><mpath href="#lcn-route" /></animateMotion></circle>
      </svg>
      <ol class="lcn-flow">
        <li v-for="(step, i) in steps" :key="step.title" ref="step" :class="['lcn-step', 'is-' + tones[i % tones.length]]">
          <div class="lcn-step__top">
            <span class="lcn-num">{{ String(i + 1).padStart(2, "0") }}</span>
            <span class="lcn-icon"><b-icon :icon="step.icon" aria-hidden="true"></b-icon></span>
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </li>
      </ol>
    </div>

    <!-- Three takeaways under the line, as plain navy text on the pale foot of the blue, split by thin rules (owner, 2026-11-16:
         "I don't like these cards"). -->
    <ul class="lcn-links">
      <li v-for="link in links" :key="link.title" class="lcn-link">
        <span class="lcn-link__icon"><b-icon :icon="link.icon" aria-hidden="true"></b-icon></span>
        <h3>{{ link.title }}</h3>
        <p>{{ link.text }}</p>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "HomeConnected",
  data: () => ({
    box: { w: 0, h: 0 },
    route: "",
    tones: ["sky", "violet", "mint", "peach"],
    steps: [
      { icon: "envelope", title: "Mail comes in", text: "Your Outlook inbox is read every 2 minutes and each thread is filed against the right client." },
      { icon: "tags", title: "Enquiry", text: "One click turns the mail into an enquiry. Pricing quotes it, and stale enquiries get a reminder every hour." },
      { icon: "kanban", title: "Job", text: "The client confirms and the enquiry becomes a job on the board, assigned to whoever has room." },
      { icon: "file-earmark-text", title: "Documents", text: "AI drafts the AWB or bill of lading from the client's papers. MAWB, HAWB, consol and PDFs come from the same job." },
      { icon: "cursor", title: "Airline", text: "The e-AWB goes out as Cargo-XML through Descartes. Accepted or rejected replies come back to the waybill." },
      { icon: "geo-alt", title: "Tracking", text: "Airline status in 7 milestones, from cargo accepted to delivered, in the job's tracking drawer." },
      { icon: "receipt", title: "Invoice", text: "The cost sheet becomes the invoice and the vouchers, with the GST split worked out." },
      { icon: "journal-bookmark", title: "Books", text: "Posted to one double-entry ledger for air and sea, then on to bank reconciliation, GSTR-1, TDS and P&L." },
    ],
    links: [
      { icon: "people", title: "Every desk sees the same job", text: "Pricing, operations, sales, accounts and the boss all work from one record, each with only what their role needs." },
      { icon: "arrow-left-right", title: "Air and sea on one board", text: "Air and sea jobs sit on the same board and post to the same books. Clients with several branches keep one account." },
      { icon: "shield-lock", title: "Money and documents agree", text: "On imports, the delivery order is released only when the bill is paid or the client is within credit." },
    ],
  }),
  mounted() {
    this.draw = () => cancelAnimationFrame(this.frame) || (this.frame = requestAnimationFrame(this.trace));
    if (window.ResizeObserver) {
      this.observer = new ResizeObserver(this.draw);
      this.observer.observe(this.$refs.flow);
    }
    window.addEventListener("resize", this.draw);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(this.draw);
    this.draw();
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.draw);
    cancelAnimationFrame(this.frame);
  },
  methods: {
    // One smooth curve through the middle of every card, in reading order.
    trace() {
      const flow = this.$refs.flow;
      const cards = this.$refs.step || [];
      if (!flow || !cards.length) return;
      const origin = flow.getBoundingClientRect();
      const w = Math.round(origin.width);
      const h = Math.round(origin.height);
      const pts = cards.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left - origin.left + r.width / 2, y: r.top - origin.top + r.height / 2, half: r.width / 2 };
      });
      let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < pts.length; i += 1) {
        const a = pts[i - 1];
        const b = pts[i];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        let c1;
        let c2;
        if (Math.abs(dx) < 8) {
          // Same column, next row: swing out past the edge and come back, like a hairpin bend.
          const out = (a.x > w / 2 ? 1 : -1) * (a.half + 70);
          c1 = [a.x + out, a.y];
          c2 = [b.x + out, b.y];
        } else if (Math.abs(dx) > Math.abs(dy)) {
          c1 = [a.x + dx * 0.55, a.y];
          c2 = [b.x - dx * 0.55, b.y];
        } else {
          // Zigzag column: leave the card by its side edge, loop out into the margin,
          // then bend down into the top of the next card.
          const side = dx > 0 ? 1 : -1;
          const sx = a.x + side * a.half;
          d += ` L${sx.toFixed(1)} ${a.y.toFixed(1)}`;
          c1 = [sx + side * 46, a.y];
          c2 = [b.x + side * 30, b.y - dy * 0.9];
        }
        d += ` C${c1.map((n) => n.toFixed(1)).join(" ")} ${c2.map((n) => n.toFixed(1)).join(" ")} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
      }
      if (this.box.w !== w || this.box.h !== h) this.box = { w, h };
      if (this.route !== d) this.route = d;
    },
  },
};
</script>

<style>
.lcn { padding: 72px 0 40px; font-family: "Inter", sans-serif; }
.lcn-road { position: relative; max-width: 1040px; margin: 48px auto 0; }
.lcn-line { position: absolute; top: 0; left: 0; overflow: visible; pointer-events: none; z-index: 0; }
.lcn-line path { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.lcn-line__glow { stroke: rgba(255, 255, 255, .35); stroke-width: 14; }
.lcn-line__dash { stroke: #fff; stroke-width: 3; stroke-dasharray: 2 11; animation: lcn-flow 1.2s linear infinite; }
.lcn-runner { fill: #fff; stroke: #2F6FCF; stroke-width: 3; }
@keyframes lcn-flow { to { stroke-dashoffset: -26; } }

.lcn-flow { position: relative; z-index: 1; list-style: none; margin: 0; padding: 0; }
.lcn-step { position: relative; padding: 16px 18px 18px; border-radius: 20px; background: #fff; box-shadow: 0 12px 30px rgba(30, 80, 160, .14); }
.lcn-step__top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.lcn-num { font-size: .75rem; font-weight: 700; letter-spacing: .06em; color: #9AA8C0; }
.lcn-icon { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 10px; font-size: 1rem; }
.lcn-step.is-sky .lcn-icon { background: #E6F0FD; color: #2F6FCF; }
.lcn-step.is-violet .lcn-icon { background: #EFEAFD; color: #6B4FD8; }
.lcn-step.is-mint .lcn-icon { background: #E8F7EE; color: #13865A; }
.lcn-step.is-peach .lcn-icon { background: #FDEEE4; color: #C8632B; }
.lcn-step h3 { margin: 0 0 4px; font-size: .9375rem; font-weight: 700; color: #102552; }
.lcn-step p { margin: 0; font-size: .8125rem; line-height: 1.5; color: #4B5B78; }

/* Desktop: two rows of four. Row two runs back from right to left, and every other card dips, so the road winds. */
@media (min-width: 992px) {
  .lcn-flow { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 64px; row-gap: 72px; align-items: start; }
  .lcn-step:nth-child(5) { grid-area: 2 / 4; }
  .lcn-step:nth-child(6) { grid-area: 2 / 3; }
  .lcn-step:nth-child(7) { grid-area: 2 / 2; }
  .lcn-step:nth-child(8) { grid-area: 2 / 1; }
  .lcn-step:nth-child(even) { margin-top: 56px; }
}
/* Smaller screens: one column that zigzags left and right down the page. */
@media (max-width: 991px) {
  .lcn-flow { display: flex; flex-direction: column; gap: 32px; }
  .lcn-step { width: min(72%, 380px); }
  .lcn-step:nth-child(odd) { align-self: flex-start; }
  .lcn-step:nth-child(even) { align-self: flex-end; }
}
@media (max-width: 575px) { .lcn-step { width: 80%; } }
@media (prefers-reduced-motion: reduce) {
  .lcn-line__dash { animation: none; }
  .lcn-runner { display: none; }
}

.lcn-links { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); max-width: 1040px; margin: 80px auto 0; padding: 0; }
.lcn-link { padding: 4px 32px; text-align: center; }
.lcn-link + .lcn-link { border-left: 1px solid rgba(30, 58, 110, .16); }
.lcn-link__icon {
  display: inline-grid; place-items: center; width: 44px; height: 44px; margin-bottom: 14px; border-radius: 50%;
  background: #fff; color: #2F6FCF; font-size: 1.125rem; box-shadow: 0 8px 20px rgba(30, 80, 160, .14);
}
.lcn-link h3 { margin: 0 0 8px; font-size: 1.0625rem; font-weight: 700; color: #102552; }
.lcn-link p { margin: 0 auto; max-width: 280px; font-size: .9375rem; line-height: 1.6; color: #2C3A57; }
@media (max-width: 991px) {
  .lcn-links { grid-template-columns: 1fr; gap: 28px; margin-top: 56px; }
  .lcn-link { padding: 0 8px; }
  .lcn-link + .lcn-link { border-left: 0; border-top: 1px solid rgba(30, 58, 110, .16); padding-top: 28px; }
}
</style>
