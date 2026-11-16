<template>
  <!--
    A plain section of cards: heading, then one card per item (title, text, optional bullet points, optional tag).
    Used for the content-first sections added 2026-11-13 (desks, accounts, trust, plans); the design comes later.
  -->
  <section class="lis" :class="'lis--' + tone" :aria-labelledby="id">
    <header class="lp-head">
      <span class="lp-eyebrow">{{ eyebrow }}</span>
      <h2 :id="id" class="lp-title" v-html="title"></h2>
      <p v-if="sub" class="lp-sub">{{ sub }}</p>
    </header>

    <div class="lis-grid" :style="{ '--lis-cols': columns }">
      <article v-for="item in items" :key="item.title" class="lis-card">
        <div class="lis-card__top">
          <span class="lis-icon"><b-icon :icon="item.icon" aria-hidden="true"></b-icon></span>
          <span v-if="item.tag" class="lis-tag">{{ item.tag }}</span>
        </div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.text }}</p>
        <ul v-if="item.points">
          <li v-for="point in item.points" :key="point"><b-icon icon="check2" aria-hidden="true"></b-icon>{{ point }}</li>
        </ul>
      </article>
    </div>

    <p v-if="note" class="lis-note">{{ note }}</p>
  </section>
</template>

<script>
export default {
  name: "HomeInfoSection",
  props: {
    id: { type: String, required: true },
    eyebrow: { type: String, required: true },
    // Trusted copy from Home.vue only (may hold <br />).
    title: { type: String, required: true },
    sub: { type: String, default: "" },
    items: { type: Array, required: true },
    columns: { type: Number, default: 3 },
    note: { type: String, default: "" },
    // Accent colour for the icons: sky, mint, violet, peach.
    tone: { type: String, default: "sky" },
  },
};
</script>

<style>
.lis { --lis-soft: #E3EFFD; --lis-ink: #2F6FCF; padding: 72px 0 40px; font-family: "Inter", sans-serif; }
.lis--mint { --lis-soft: #DCF5E7; --lis-ink: #137A47; }
.lis--violet { --lis-soft: #EDE9FE; --lis-ink: #6D28D9; }
.lis--peach { --lis-soft: #FDE8DC; --lis-ink: #B4532A; }

.lis-grid { display: grid; grid-template-columns: repeat(var(--lis-cols, 3), 1fr); gap: 18px; margin-top: 44px; }
.lis-card { padding: 26px; border-radius: 24px; background: #fff; box-shadow: 0 10px 30px rgba(38, 68, 127, .06); }
.lis-card__top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.lis-icon { display: inline-grid; place-items: center; width: 42px; height: 42px; border-radius: 13px; background: var(--lis-soft); color: var(--lis-ink); font-size: 1.1875rem; }
.lis-tag { padding: 3px 10px; border-radius: 999px; background: var(--lis-soft); color: var(--lis-ink); font-size: .75rem; font-weight: 600; }
.lis-card h3 { margin: 16px 0 6px; font-size: 1.125rem; font-weight: 700; letter-spacing: -.01em; color: #102552; }
.lis-card p { margin: 0; font-size: .9rem; line-height: 1.6; color: #4B5B78; }
.lis-card ul { margin: 14px 0 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.lis-card li { display: flex; gap: 8px; align-items: baseline; font-size: .875rem; font-weight: 500; color: #2C3A57; }
.lis-card li svg { color: #13865A; flex: 0 0 auto; transform: translateY(2px); }
.lis-note { margin: 22px auto 0; max-width: 620px; text-align: center; font-size: .875rem; color: #6B7A93; }

@media (max-width: 991px) { .lis-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 575px) { .lis-grid { grid-template-columns: 1fr; } }
</style>
