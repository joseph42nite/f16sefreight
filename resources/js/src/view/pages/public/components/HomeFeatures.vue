<template>
  <!--
    Features, the first thing on the sheet under the hero (landing redesign, 2026-11-12; third pass on the owner's
    "Structure that adapts" reference): an eyebrow, a centred title, then cards in soft violet / sky / mint gradients —
    title and line on top, a picture of the real screen rising from the bottom edge. A real cloud drifts behind.

    Owner's list: AI from invoice + packing list to the AWB (wide), tracking, assigning, AI document reading, why clients
    leave, staff, numbers on how the team works.

    🔴 EVERY CARD IS A SHIPPED FEATURE — docs/LANDING_PAGE.md §1a gives the source of each. The pictures use made-up
    shipments and people; they are HTML, not screenshots, so they stay sharp.
    Cloud: "white clouds and blue sky", Unsplash A9_IsUtjHm4 (free, Unsplash License), sky keyed out.
  -->
  <section class="lf" aria-labelledby="features-heading">
    <img class="lf-cloud lf-cloud--right" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
    <img class="lf-cloud lf-cloud--left" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />

    <header class="lf-head">
      <span class="lf-eyebrow">Why F16s</span>
      <h2 id="features-heading" class="lf-title">Run every shipment.<br />No more guessing.</h2>
      <p class="lf-sub">Track it, assign it, price it right, and see exactly how your team and your clients are doing.</p>
    </header>

    <div class="lf-grid">
      <!-- 1 (wide). AI: invoice + packing list → final AWB draft. python/model_extract.py -->
      <article class="lf-card lf-card--wide">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>From packing list and invoice to final AWB, in seconds</h3>
          <p>Drop in the client's invoice and packing list. AI fills the waybill, and you only check what it flags.</p>
        </div>
        <div class="lf-art lf-art--wide" aria-hidden="true">
          <div class="lf-docs">
            <span class="lf-doc"><b-icon icon="file-earmark-text"></b-icon><b>Commercial invoice</b><small>INV-2291.pdf</small></span>
            <span class="lf-doc"><b-icon icon="file-earmark-ruled"></b-icon><b>Packing list</b><small>PL-2291.pdf</small></span>
          </div>
          <span class="lf-flow"><b-icon icon="stars"></b-icon></span>
          <div class="lf-panel lf-awb">
            <div class="lf-panel__head"><b>House AWB · draft</b><span class="lf-tag lf-tag--green"><b-icon icon="check2"></b-icon> 18 of 20 filled</span></div>
            <div class="lf-fields">
              <span v-for="f in awbFields" :key="f.k" class="lf-field" :class="{ 'is-check': f.check }"><small>{{ f.k }}</small>{{ f.v }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- 2. Tracking. JobController::tracking, core/config/cargoMilestones.js -->
      <article class="lf-card lf-card--sky">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>Track every shipment</h3>
          <p>Airline status lands on the job by itself, from cargo accepted to delivered.</p>
        </div>
        <div class="lf-art" aria-hidden="true">
          <div class="lf-panel">
            <div class="lf-panel__head"><b>176-50000404</b><span class="lf-tag lf-tag--blue">BOM ✈ SIN</span></div>
            <ol class="lf-steps">
              <li v-for="(s, i) in milestones" :key="s" :class="{ 'is-done': i < 4, 'is-now': i === 4 }">{{ s }}</li>
            </ol>
          </div>
        </div>
      </article>

      <!-- 3. Assigning. JobController::reassign / requestReassignment, OperatorLoadService -->
      <article class="lf-card lf-card--violet">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>Assign jobs in a click</h3>
          <p>See who has room before you hand a job over. Reassigning goes through an approval.</p>
        </div>
        <div class="lf-art" aria-hidden="true">
          <div class="lf-panel">
            <div class="lf-panel__head"><b>Assign 176-60604111</b></div>
            <div v-for="p in people" :key="p.name" class="lf-person" :class="{ 'is-best': p.best }">
              <span class="lf-avatar" :class="'lf-avatar--' + p.tone">{{ p.name.split(' ').map(w => w[0]).join('') }}</span>
              <span class="lf-person__name">{{ p.name }}<small>{{ p.jobs }} active jobs</small></span>
              <span class="lf-load"><i :style="{ width: p.load + '%' }"></i></span>
            </div>
            <span class="lf-note lf-note--ok"><b-icon icon="check2-circle"></b-icon> Anita has the most room</span>
          </div>
        </div>
      </article>

      <!-- 4. AI document reading. JobDocumentController (awb_copy, bl_copy, delivery_order…), AI vision for scans -->
      <article class="lf-card lf-card--mint">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>AI reads your documents</h3>
          <p>Scans of airway bills, bills of lading and delivery orders, read straight into the job. No retyping.</p>
        </div>
        <div class="lf-art" aria-hidden="true">
          <div class="lf-scan">
            <div class="lf-page">
              <span class="lf-page__title">AIR WAYBILL</span>
              <span class="lf-hl lf-hl--a"></span>
              <span class="lf-line"></span><span class="lf-line lf-line--short"></span>
              <span class="lf-hl lf-hl--b"></span>
              <span class="lf-line"></span><span class="lf-line lf-line--short"></span>
            </div>
            <div class="lf-out">
              <span v-for="x in extracted" :key="x.k" class="lf-chip"><small>{{ x.k }}</small>{{ x.v }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- 5. Why clients leave. Enquiry lost_reason, Sales\ClientFindings -->
      <article class="lf-card lf-card--peach">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>Know which clients left, and why</h3>
          <p>Every lost enquiry keeps its reason. See the lanes where you lose most.</p>
        </div>
        <div class="lf-art" aria-hidden="true">
          <div class="lf-panel">
            <div class="lf-panel__head"><b>Lost enquiries · this quarter</b><small>38</small></div>
            <div v-for="r in reasons" :key="r.k" class="lf-reason">
              <span>{{ r.k }}</span>
              <span class="lf-bar"><i :style="{ width: r.v + '%', background: r.c }"></i></span>
              <b>{{ r.v }}%</b>
            </div>
            <span class="lf-note"><b-icon icon="info-circle"></b-icon> Most lost on price: BOM → DXB</span>
          </div>
        </div>
      </article>

      <!-- 6. Staff. Sales\StaffReviews, quarterly reviews -->
      <article class="lf-card lf-card--butter">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>Keep track of your staff</h3>
          <p>Who is on what, what is running late, and a quarterly review for every person.</p>
        </div>
        <div class="lf-art" aria-hidden="true">
          <div class="lf-panel">
            <div class="lf-panel__head"><b>Your team · today</b><span class="lf-tag lf-tag--violet">Q3 reviews ready</span></div>
            <div class="lf-table">
              <span class="lf-th">Staff</span><span class="lf-th">Desk</span><span class="lf-th">Jobs</span><span class="lf-th">Late</span>
              <template v-for="s in staff">
                <span :key="s.name + 'n'"><b>{{ s.name }}</b></span>
                <span :key="s.name + 'd'">{{ s.desk }}</span>
                <span :key="s.name + 'j'">{{ s.jobs }}</span>
                <span :key="s.name + 'o'" :class="{ 'is-late': s.late }">{{ s.late }}</span>
              </template>
            </div>
          </div>
        </div>
      </article>

      <!-- 7. Internal numbers. OperatorLoadService (workload score), Sales\OpsScorecard -->
      <article class="lf-card lf-card--rose">
        <img class="lf-card__cloud" src="/media/assets/banners/cloud.png" alt="" aria-hidden="true" loading="lazy" />
        <div class="lf-copy">
          <h3>Numbers on how your team works</h3>
          <p>Days slower per step, airline rejections, weight gaps and a workload score per person.</p>
        </div>
        <div class="lf-art" aria-hidden="true">
          <div class="lf-panel">
            <div class="lf-panel__head"><b>Operations · Q3</b><small>vs other clients</small></div>
            <div class="lf-kpis">
              <span v-for="k in kpis" :key="k.k" class="lf-kpi"><b :class="k.tone">{{ k.v }}</b><small>{{ k.k }}</small></span>
            </div>
            <div class="lf-formula"><small>Workload score</small> complexity × urgency, per person</div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomeFeatures",
  data: () => ({
    awbFields: [
      { k: "Shipper", v: "Contoso Exports Pvt Ltd" },
      { k: "Consignee", v: "Müller Handels GmbH" },
      { k: "Route", v: "BOM → FRA" },
      { k: "Pieces", v: "5" },
      { k: "Gross weight", v: "910 kg" },
      { k: "Goods", v: "Auto parts", check: true },
    ],
    milestones: ["Cargo accepted", "Manifested", "Departed", "Arrived", "Customs cleared", "Out for delivery", "Delivered"],
    people: [
      { name: "Rahul Iyer", jobs: 9, load: 78, tone: "amber" },
      { name: "Anita Rao", jobs: 4, load: 32, tone: "teal", best: true },
      { name: "Vikram Shah", jobs: 7, load: 61, tone: "violet" },
    ],
    extracted: [
      { k: "AWB", v: "176-50000404" },
      { k: "Shipper", v: "Contoso Exports" },
      { k: "Pieces", v: "11" },
      { k: "Weight", v: "260 kg" },
    ],
    // The reasons an enquiry can be lost for (EnquiryController: rates_high … other).
    reasons: [
      { k: "Rates too high", v: 46, c: "#F87171" },
      { k: "Slow reply", v: 22, c: "#FBBF24" },
      { k: "Client cancelled", v: 18, c: "#60A5FA" },
      { k: "No capacity", v: 9, c: "#A78BFA" },
    ],
    staff: [
      { name: "Rahul", desk: "Ops", jobs: 9, late: 2 },
      { name: "Anita", desk: "Ops", jobs: 4, late: 0 },
      { name: "Meera", desk: "Pricing", jobs: 12, late: 1 },
      { name: "Vikram", desk: "Sales", jobs: 7, late: 0 },
    ],
    kpis: [
      { k: "days slower", v: "+1.4", tone: "is-bad" },
      { k: "airline rejections", v: "3%", tone: "is-good" },
      { k: "weight gap", v: "2.1%", tone: "is-good" },
    ],
  }),
};
</script>

<style>
.lf { position: relative; padding: 96px 0 56px; font-family: "Inter", sans-serif; }

/* A real cloud behind the section (owner, 2026-11-12), as in the reference: one off the right edge, one low left. */
.lf-cloud { position: absolute; z-index: 0; pointer-events: none; user-select: none; }
.lf-cloud--right { top: 10px; right: -260px; width: 560px; opacity: .95; }
.lf-cloud--left { top: 520px; left: -300px; width: 460px; opacity: .8; transform: scaleX(-1); }

.lf-head { position: relative; z-index: 1; text-align: center; margin-bottom: 48px; }
.lf-eyebrow { display: block; margin-bottom: 14px; font-size: .75rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #6B7A93; }
.lf-title { margin: 0 0 14px; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.12; font-weight: 500; letter-spacing: -.03em; color: #1E3A6E; }
.lf-sub { margin: 0 auto; max-width: 480px; font-size: 1rem; line-height: 1.6; color: #6B7A93; }

/* ── Cards: soft violet / sky / mint, title on top, the screen rising from the bottom edge ─────────────────── */
.lf-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.lf-card {
  --c1: #CDBFF8; --c2: #EEE9FD;
  position: relative; isolation: isolate; overflow: hidden;
  display: flex; flex-direction: column; height: 400px; padding: 30px 26px 0; border-radius: 24px;
  background: linear-gradient(180deg, var(--c1) 0%, var(--c2) 100%);
  text-align: center; transition: transform .25s ease, box-shadow .25s ease;
}
.lf-card:hover { transform: translateY(-4px); box-shadow: 0 22px 44px rgba(38, 68, 127, .14); }
/* Paler tops than the first pass, so the titles read clearly (owner, 2026-11-12). */
.lf-card--violet { --c1: #CDBFF8; --c2: #EEE9FD; }
.lf-card--sky { --c1: #AFD4F7; --c2: #E2EFFC; }
.lf-card--mint { --c1: #B9E8CB; --c2: #E6F7EC; }
/* More hues so each card is its own (owner, 2026-11-12: "use other colors if relevant"). */
.lf-card--peach { --c1: #FBCDB3; --c2: #FDEDE3; }
.lf-card--butter { --c1: #F6DF96; --c2: #FCF4DA; }
.lf-card--rose { --c1: #F5BCD3; --c2: #FCE9F1; }
.lf-card--wide {
  grid-column: 1 / -1; height: auto; padding-bottom: 0;
  background: linear-gradient(110deg, #D2C6F8 0%, #B3D7F7 50%, #BDE9CF 100%);
}
/* A soft, low cloud inside each card, like the haze in the reference (an img, not a CSS url(), so webpack leaves it be). */
.lf-card__cloud {
  position: absolute; z-index: -1; left: 50%; bottom: -38%; width: 140%; max-width: none; transform: translateX(-50%);
  /* Screen: the cloud only ever lightens the gradient, so its shading never reads as grey dirt. */
  opacity: .9; mix-blend-mode: screen; pointer-events: none;
}
/* Just a light haze along the wide card's foot (owner: the full cloud was too much). */
.lf-card--wide .lf-card__cloud { bottom: -95%; width: 70%; opacity: .45; }

.lf-copy { flex: 0 0 auto; }
.lf-card h3 { margin: 0 0 8px; font-size: 1.5rem; font-weight: 700; line-height: 1.2; letter-spacing: -.02em; color: #102552; }
.lf-card--wide h3 { font-size: 1.875rem; }
.lf-card p { margin: 0 auto; max-width: 300px; font-size: .9375rem; line-height: 1.5; font-weight: 500; color: #2C3A57; }
.lf-card--wide p { max-width: 520px; }

/* The picture sits at the bottom and runs off the card's edge. */
.lf-art { position: relative; margin-top: auto; width: 100%; transform: translateY(18px); }
.lf-art--wide { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 26px; padding-bottom: 46px; transform: none; }

/* Shared bits */
.lf-panel {
  width: 100%; padding: 14px 16px 22px; border-radius: 16px 16px 0 0; background: rgba(255, 255, 255, .94); text-align: left;
  box-shadow: 0 -6px 30px rgba(38, 68, 127, .10); font-size: .8125rem; color: #374151;
}
.lf-art--wide .lf-panel { border-radius: 16px; padding-bottom: 14px; }
.lf-panel__head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
.lf-panel__head b { color: #1E3A6E; font-size: .875rem; }
.lf-panel__head small { color: #8A97AD; }
.lf-tag { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; background: #EEF1F6; font-size: .6875rem; font-weight: 600; color: #4B5B78; white-space: nowrap; }
.lf-tag--blue { background: #E3EFFD; color: #2F6FCF; }
.lf-tag--green { background: #DCF5E7; color: #137A47; }
.lf-tag--violet { background: #EDE9FE; color: #6D28D9; }
.lf-bar { display: block; height: 6px; border-radius: 3px; background: #E5EAF2; overflow: hidden; }
.lf-bar i { display: block; height: 100%; border-radius: 3px; background: #14B8A6; }
.lf-note { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: .75rem; font-weight: 500; color: #2F6FCF; }
.lf-note--ok { color: #137A47; }
.lf-line { display: block; height: 6px; border-radius: 3px; background: #E7EBF2; margin-top: 7px; }
.lf-line--short { width: 60%; }

/* 1 — documents → AI → AWB */
.lf-docs { display: flex; flex-direction: column; gap: 12px; }
.lf-doc {
  display: grid; grid-template-columns: 34px 1fr; grid-template-rows: auto auto; column-gap: 10px; align-items: center;
  padding: 12px 16px 12px 12px; border-radius: 14px; background: #fff; box-shadow: 0 8px 22px rgba(38, 68, 127, .10); text-align: left;
}
.lf-doc svg { grid-row: 1 / 3; width: 34px; height: 34px; padding: 7px; border-radius: 10px; background: #FEF3C7; color: #B45309; }
.lf-doc:nth-child(2) svg { background: #E0F2F1; color: #0F766E; }
.lf-doc b { font-size: .8125rem; color: #1E3A6E; }
.lf-doc small { font-size: .6875rem; color: #8A97AD; }
.lf-flow {
  flex: 0 0 auto; width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%;
  background: #fff; color: #3E8BEA; font-size: 1.25rem; box-shadow: 0 0 0 8px rgba(255, 255, 255, .35);
}
.lf-awb { max-width: 400px; }
.lf-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.lf-field { display: flex; flex-direction: column; padding: 6px 9px; border-radius: 9px; background: #F4F6F9; font-weight: 600; color: #1E3A6E; font-size: .75rem; }
.lf-field small { font-size: .625rem; font-weight: 500; color: #8A97AD; text-transform: uppercase; letter-spacing: .04em; }
.lf-field.is-check { background: #FEF3C7; box-shadow: inset 0 0 0 1px #FCD34D; }

/* 2 — milestones */
.lf-steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 5px; }
.lf-steps li { display: flex; align-items: center; gap: 8px; font-size: .75rem; color: #9AA5B8; }
.lf-steps li::before { content: ""; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #D5DCE7; }
.lf-steps li.is-done { color: #374151; }
.lf-steps li.is-done::before { background: #14B8A6; border-color: #14B8A6; }
.lf-steps li.is-now { color: #1E3A6E; font-weight: 600; }
.lf-steps li.is-now::before { border-color: #3E8BEA; box-shadow: 0 0 0 3px rgba(62, 139, 234, .2); }

/* 3 — who has room */
.lf-person { display: flex; align-items: center; gap: 10px; padding: 6px 8px; margin: 0 -8px; border-radius: 10px; }
.lf-person.is-best { background: #F0FAF5; }
.lf-avatar { flex: 0 0 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; font-size: .625rem; font-weight: 700; }
.lf-avatar--amber { background: #FEF3C7; color: #92400E; }
.lf-avatar--teal { background: #CCFBF1; color: #115E59; }
.lf-avatar--violet { background: #EDE9FE; color: #5B21B6; }
.lf-person__name { display: flex; flex-direction: column; width: 92px; font-weight: 600; color: #1E3A6E; font-size: .75rem; }
.lf-person__name small { font-weight: 400; color: #8A97AD; font-size: .6875rem; }
.lf-load { flex: 1; height: 6px; border-radius: 3px; background: #E5EAF2; overflow: hidden; }
.lf-load i { display: block; height: 100%; border-radius: 3px; background: #3E8BEA; }

/* 4 — a scanned page and what AI read off it */
.lf-scan { display: flex; align-items: flex-end; gap: 12px; }
.lf-page {
  flex: 0 0 46%; height: 190px; padding: 14px 12px; border-radius: 14px 14px 0 0; background: #fff; text-align: left;
  box-shadow: 0 -6px 30px rgba(38, 68, 127, .10); filter: grayscale(.2);
}
.lf-page__title { display: block; font-size: .5625rem; font-weight: 800; letter-spacing: .12em; color: #9AA5B8; margin-bottom: 8px; }
.lf-hl { display: block; height: 14px; border-radius: 4px; margin-top: 10px; background: rgba(62, 139, 234, .18); box-shadow: inset 0 0 0 1.5px #3E8BEA; }
.lf-hl--a { width: 70%; }
.lf-hl--b { width: 50%; background: rgba(20, 184, 166, .18); box-shadow: inset 0 0 0 1.5px #14B8A6; }
.lf-out { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-bottom: 24px; }
.lf-chip { display: flex; flex-direction: column; padding: 6px 10px; border-radius: 10px; background: #fff; box-shadow: 0 6px 16px rgba(38, 68, 127, .10); text-align: left; font-size: .75rem; font-weight: 600; color: #1E3A6E; }
.lf-chip small { font-size: .5625rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: #13865A; }

/* 5 — reasons */
.lf-reason { display: grid; grid-template-columns: 100px 1fr 34px; align-items: center; gap: 8px; padding: 4px 0; font-size: .75rem; }
.lf-reason b { text-align: right; color: #1E3A6E; }

/* 6 — staff table */
.lf-table { display: grid; grid-template-columns: 1.3fr 1fr .7fr .7fr; row-gap: 6px; font-size: .75rem; }
.lf-table > span { padding: 3px 0; border-top: 1px solid #F0F2F6; }
.lf-table > .lf-th { border-top: 0; font-size: .625rem; font-weight: 600; color: #8A97AD; text-transform: uppercase; letter-spacing: .04em; }
.lf-table b { color: #1E3A6E; }
.lf-table .is-late { color: #DC2626; font-weight: 700; }

/* 7 — KPIs */
.lf-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.lf-kpi { display: flex; flex-direction: column; padding: 10px; border-radius: 12px; background: #F4F6F9; }
.lf-kpi b { font-size: 1.125rem; letter-spacing: -.02em; }
.lf-kpi b.is-good { color: #137A47; }
.lf-kpi b.is-bad { color: #DC2626; }
.lf-kpi small { font-size: .6875rem; color: #8A97AD; }
.lf-formula { margin-top: 10px; padding: 8px 10px; border-radius: 10px; background: #EEF5FF; font-size: .75rem; color: #2F6FCF; }
.lf-formula small { display: block; font-size: .625rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: #8A97AD; }

@media (max-width: 1199px) {
  .lf-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 991px) {
  .lf-art--wide { flex-direction: column; }
  .lf-docs { flex-direction: row; }
  .lf-flow { transform: rotate(90deg); }
  .lf-cloud--left { display: none; }
}
@media (max-width: 767px) {
  .lf { padding-top: 64px; }
  .lf-grid { grid-template-columns: 1fr; }
  .lf-card { height: 380px; padding: 24px 18px 0; }
  .lf-docs { flex-direction: column; }
  .lf-cloud--right { right: -200px; width: 380px; }
}
@media (prefers-reduced-motion: reduce) { .lf-card { transition: none; } }
</style>
