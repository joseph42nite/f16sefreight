<template>
  <!--
    The Operational Board, drawn in HTML for the laptop in the hero (landing redesign, 2026-11-12).

    🔴 A PICTURE, NOT THE APP: made-up shipments, nothing is fetched, nothing is clickable. It is drawn at a fixed
    1280 px wide (its height follows the box) and scaled to whatever box it sits in, so it stays sharp on any screen where a screenshot would blur.
    It copies the real board's look (AppShell + JobBoard): change that, and this should follow.
  -->
  <div ref="frame" class="hb-frame" aria-hidden="true">
    <div class="hb" :style="{ transform: 'scale(' + scale + ')', height: height + 'px' }">
      <aside class="hb-rail">
        <span class="hb-logo">F16s.</span>
        <span v-for="(icon, i) in rail" :key="icon" class="hb-rail__item" :class="{ 'is-on': i === 1 }">
          <b-icon :icon="icon"></b-icon>
        </span>
      </aside>

      <div class="hb-main">
        <header class="hb-top">
          <span class="hb-top__title">Operational Board</span>
          <span class="hb-top__me"><span class="hb-avatar hb-avatar--violet">PN</span>Priya Nair</span>
        </header>

        <div class="hb-card">
          <div class="hb-tools">
            <span class="hb-search"><b-icon icon="search"></b-icon>Search in AWB, job no. or DST</span>
            <span class="hb-switch"><span class="is-on">Kanban</span><span>Staff</span></span>
          </div>

          <section class="hb-pool">
            <span class="hb-h">Unassigned Mails</span>
            <div class="hb-pool__row">
              <span v-for="m in mails" :key="m.name" class="hb-mail" :class="'hb-mail--' + m.band">
                <span class="hb-mail__btn">−</span>
                <span class="hb-mail__body">
                  <b>{{ m.name }} <i>{{ m.tag }}</i></b>
                  <small>{{ m.when }}</small>
                </span>
                <span class="hb-mail__btn">+</span>
              </span>
            </div>
          </section>

          <div class="hb-cols">
            <section v-for="col in columns" :key="col.title" class="hb-col">
              <header class="hb-col__head"><span class="hb-h">{{ col.title }}</span><span class="hb-count">{{ col.cards.length }}</span></header>
              <article v-for="c in col.cards" :key="c.awb" class="hb-job">
                <div class="hb-job__top">
                  <b>{{ c.awb }}</b>
                  <span class="hb-chip"><i :style="{ background: col.dot }"></i>{{ c.stage }}</span>
                </div>
                <small class="hb-job__ref">{{ c.job }} <em :class="c.dir === 'Export' ? 'is-exp' : 'is-imp'">{{ c.dir }}</em></small>
                <span class="hb-job__client">{{ c.client }}</span>
                <span class="hb-job__lane">{{ c.lane }}</span>
                <div class="hb-stats">
                  <span><small>Pieces</small>{{ c.pcs }}</span>
                  <span><small>Weight</small>{{ c.kg }} kg</span>
                  <span><small>Cargo</small>General</span>
                </div>
                <div v-if="c.progress" class="hb-bar"><i :style="{ width: c.progress + '%' }"></i></div>
                <footer class="hb-job__foot">
                  <span class="hb-avatar" :class="'hb-avatar--' + c.tone">{{ c.who.split(' ').map(w => w[0]).join('') }}</span>
                  <span class="hb-who">{{ c.who }}<small>Operations</small></span>
                  <span class="hb-act"><b-icon :icon="col.action"></b-icon></span>
                </footer>
              </article>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** The board's natural size: the scale maps it onto the laptop's screen. */
const W = 1280;

export default {
  name: "HomeBoardScreen",
  data: () => ({
    scale: 0.5,
    /** The board is 1280 wide; its height follows the screen's shape, so it always fills it. */
    height: 800,
    rail: ["inbox", "kanban", "people", "files", "chat-left", "cart", "send", "journal-text", "gear"],
    mails: [
      { name: "Contoso Exports", tag: "New", when: "12 Nov | 25 min", band: "fresh" },
      { name: "Globex Mumbai", tag: "Waiting", when: "12 Nov | 3 h", band: "aging" },
      { name: "Northwind Traders", tag: "Late", when: "11 Nov | 1 d", band: "late" },
    ],
    columns: [
      { title: "Processing", dot: "#E62E97", action: "envelope", cards: [
        { awb: "176-50000400", job: "BOM-26-0769", dir: "Export", stage: "Intake", client: "Contoso Exports", lane: "BOM ✈ FRA · Clears 14 Nov", pcs: 5, kg: 910, who: "Rahul Iyer", tone: "amber" },
        { awb: "176-60604111", job: "BOM-26-0834", dir: "Export", stage: "Intake", client: "Northwind Traders", lane: "BOM ✈ DXB · Clears 15 Nov", pcs: 6, kg: 240, who: "Anita Rao", tone: "teal" },
      ] },
      { title: "Awaiting Customer", dot: "#F5B800", action: "envelope", cards: [
        { awb: "176-50000401", job: "BOM-26-0770", dir: "Export", stage: "PDF Generated", client: "Globex Mumbai", lane: "BOM ✈ LHR · Clears 13 Nov", pcs: 12, kg: 240, who: "Rahul Iyer", tone: "amber" },
        { awb: "176-10000410", job: "BOM-26-0811", dir: "Import", stage: "PDF Generated", client: "Initech Pharma", lane: "JFK ✈ BOM · Clears 16 Nov", pcs: 16, kg: 793, who: "Vikram Shah", tone: "violet" },
      ] },
      { title: "In-Transit", dot: "#0789BE", action: "geo-alt", cards: [
        { awb: "176-50000404", job: "BOM-26-0773", dir: "Export", stage: "Arrived", client: "Northwind Traders", lane: "BOM ✈ SIN · Landed", pcs: 11, kg: 260, who: "Anita Rao", tone: "teal", progress: 86 },
        { awb: "176-50000403", job: "BOM-26-0772", dir: "Export", stage: "Departed", client: "Contoso Exports", lane: "BOM ✈ CDG · In the air", pcs: 3, kg: 450, who: "Rahul Iyer", tone: "amber", progress: 43 },
      ] },
      { title: "Completed", dot: "#00844D", action: "send", cards: [
        { awb: "176-50000405", job: "BOM-26-0774", dir: "Export", stage: "Completed", client: "Globex Mumbai", lane: "BOM ✈ AMS · Delivered", pcs: 9, kg: 640, who: "Vikram Shah", tone: "violet" },
      ] },
    ],
  }),
  mounted() {
    this.fit();
    if (window.ResizeObserver) {
      this.observer = new ResizeObserver(() => this.fit());
      this.observer.observe(this.$refs.frame);
    } else {
      window.addEventListener("resize", this.fit);
    }
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.fit);
  },
  methods: {
    fit() {
      const frame = this.$refs.frame;
      if (!frame || !frame.clientWidth) return;
      this.scale = frame.clientWidth / W;
      this.height = Math.round(frame.clientHeight / this.scale);
    },
  },
};
</script>

<style>
.hb-frame { position: relative; width: 100%; height: 100%; overflow: hidden; background: #E9EEF8; }
.hb {
  position: absolute; top: 0; left: 0; width: 1280px; height: 800px; transform-origin: 0 0;
  display: flex; gap: 0; font-family: "Inter", sans-serif; color: #374151;
  background: linear-gradient(160deg, #DCE6F7 0%, #EEF2FA 55%, #E4ECF8 100%);
}
.hb small { font-size: inherit; }

.hb-rail { flex: 0 0 92px; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 26px; }
.hb-logo { font-size: 26px; font-weight: 800; color: #355594; letter-spacing: -.5px; margin-bottom: 18px; }
.hb-rail__item { width: 56px; height: 46px; display: grid; place-items: center; border-radius: 14px; color: #466CB6; font-size: 20px; }
.hb-rail__item.is-on { background: #fff; color: #355594; box-shadow: 0 6px 16px rgba(53, 85, 148, .12); }

.hb-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; padding: 18px 18px 18px 0; }
.hb-top { display: flex; align-items: center; justify-content: space-between; height: 54px; padding: 0 8px 12px; }
.hb-top__title { font-size: 26px; font-weight: 500; color: #26447F; }
.hb-top__me { display: inline-flex; align-items: center; gap: 10px; padding: 6px 18px 6px 6px; border-radius: 999px; background: #fff; font-size: 14px; font-weight: 600; color: #26447F; }

.hb-card { flex: 1 1 auto; display: flex; flex-direction: column; gap: 16px; padding: 20px; border-radius: 28px; background: #fff; box-shadow: 0 10px 30px rgba(53, 85, 148, .08); overflow: hidden; }
.hb-tools { display: flex; gap: 12px; }
.hb-search { flex: 1; display: flex; align-items: center; gap: 10px; height: 40px; padding: 0 16px; border-radius: 999px; border: 1px solid #E5E7EB; color: #9CA3AF; font-size: 13px; }
.hb-switch { display: flex; padding: 4px; border-radius: 999px; border: 1px solid #E5E7EB; font-size: 13px; font-weight: 500; }
.hb-switch span { padding: 7px 18px; border-radius: 999px; }
.hb-switch .is-on { background: #F3F4F6; color: #26447F; }

.hb-h { font-size: 16px; font-weight: 800; color: #355594; letter-spacing: -.2px; }
.hb-pool { padding: 14px 16px 16px; border-radius: 22px; background: #F3F4F6; }
.hb-pool__row { display: flex; gap: 14px; margin-top: 10px; }
.hb-mail { flex: 1; display: flex; align-items: center; gap: 8px; height: 58px; padding: 0 9px; border-radius: 30px; background: #C8F09A; color: #2F5A12; }
.hb-mail--aging { background: #FFF3A6; color: #4F4A1E; }
.hb-mail--late { background: #FFB3B3; color: #5E1E1E; }
.hb-mail__btn { flex: 0 0 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: #fff; color: #26447F; font-size: 18px; font-weight: 600; }
.hb-mail__body { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 14px; }
.hb-mail__body i { font-style: normal; font-size: 10px; padding: 1px 6px; border-radius: 5px; background: rgba(0, 0, 0, .18); color: #fff; vertical-align: 2px; }
.hb-mail__body small { font-size: 11px; opacity: .85; }

.hb-cols { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; min-height: 0; }
.hb-col { display: flex; flex-direction: column; gap: 10px; padding: 14px 10px; border-radius: 22px; background: #F3F4F6; overflow: hidden; }
.hb-col__head { display: flex; align-items: center; justify-content: space-between; padding: 0 6px 2px; }
.hb-count { min-width: 24px; height: 24px; display: grid; place-items: center; border-radius: 999px; background: #fff; border: 1px solid #E5E7EB; font-size: 12px; font-weight: 600; }

.hb-job { display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: 18px; background: #fff; box-shadow: 0 4px 12px rgba(17, 24, 39, .05); font-size: 11px; }
.hb-job__top { display: flex; align-items: center; justify-content: space-between; }
.hb-job__top b { font-size: 15px; font-weight: 600; color: #26447F; }
.hb-chip { display: inline-flex; align-items: center; gap: 5px; padding: 2px 8px; border-radius: 999px; background: #F3F4F6; font-size: 10px; }
.hb-chip i { width: 6px; height: 6px; border-radius: 50%; }
.hb-job__ref { color: #6B7280; font-size: 10px; }
.hb-job__ref em { font-style: normal; margin-left: 4px; padding: 0 5px; border-radius: 4px; font-size: 9px; }
.hb-job__ref .is-exp { background: #FEF3C7; color: #92400E; }
.hb-job__ref .is-imp { background: #CCFBF1; color: #115E59; }
.hb-job__client { font-size: 12px; font-weight: 600; color: #374151; margin-top: 2px; }
.hb-job__lane { color: #6B7280; font-size: 10px; }
.hb-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin-top: 4px; }
.hb-stats span { display: flex; flex-direction: column; padding: 5px 7px; border-radius: 9px; background: #F3F4F6; font-weight: 600; color: #374151; }
.hb-stats small { font-size: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: .4px; color: #6B7280; }
.hb-bar { height: 5px; border-radius: 3px; background: #E5E7EB; margin-top: 4px; }
.hb-bar i { display: block; height: 100%; border-radius: 3px; background: #14B8A6; }
.hb-job__foot { display: flex; align-items: center; gap: 7px; margin-top: 6px; }
.hb-avatar { flex: 0 0 26px; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; font-size: 10px; font-weight: 700; }
.hb-avatar--amber { background: #FEF3C7; color: #92400E; }
.hb-avatar--teal { background: #CCFBF1; color: #115E59; }
.hb-avatar--violet { background: #EDE9FE; color: #5B21B6; }
.hb-who { flex: 1; display: flex; flex-direction: column; font-size: 10px; font-weight: 600; line-height: 1.2; }
.hb-who small { font-size: 9px; font-weight: 400; color: #6B7280; }
.hb-act { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; background: #26447F; color: #fff; font-size: 13px; }
</style>
