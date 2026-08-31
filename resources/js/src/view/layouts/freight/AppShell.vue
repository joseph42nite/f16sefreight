<template>
  <div class="fx-shell" :data-portal="portal && portal.key">
    <a href="#fx-main" class="skip-to-content">Skip to content</a>

    <aside class="fx-rail" :class="{ 'is-collapsed': collapsed }">
      <div class="fx-rail__brand">
        <span class="fx-rail__mark">F16s</span>
        <button
          class="fx-rail__toggle"
          :aria-expanded="String(!collapsed)"
          aria-label="Toggle navigation"
          @click="collapsed = !collapsed"
        >‹</button>
      </div>

      <nav class="fx-rail__nav" aria-label="Main">
        <!--
          §8.1 — a tier-locked item stays VISIBLE and routes to the upgrade teaser.
          Hiding it would hide the reason to upgrade. Role-forbidden items never
          reach this list at all.
        -->
        <router-link
          v-for="item in nav"
          :key="item.path"
          :to="item.locked ? '/upgrade?from=' + encodeURIComponent(item.path) : item.path"
          class="fx-rail__item"
          :class="{ 'is-locked': item.locked }"
        >
          <span class="fx-rail__label">{{ item.label }}</span>
          <span v-if="item.locked" class="fx-rail__lock" aria-label="Requires an upgrade">🔒</span>
        </router-link>
      </nav>
    </aside>

    <div class="fx-body">
      <header class="fx-header">
        <!--
          §8.4 — the portal chip is persistent and always visible. Air and sea data must
          never be mistaken for one another: a user who forgets which portal they are in
          misreads every figure on screen.
        -->
        <span v-if="portal" class="fx-portal-chip">
          {{ portalGlyph }} {{ portal.label }}
        </span>

        <div class="fx-header__spacer"></div>

        <BellPanel />

        <span class="fx-header__who">
          {{ designation }}<template v-if="tier"> · {{ tier }}</template>
        </span>
      </header>

      <main id="fx-main" class="fx-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { visibleNavFor } from "@/core/config/navigation";
import BellPanel from "@/view/pages/freight/components/BellPanel.vue";

export default {
  name: "AppShell",
  components: { BellPanel },
  data: () => ({ collapsed: false }),
  computed: {
    ...mapGetters(["designation", "tier", "portal", "tierAtLeast"]),
    nav() {
      return visibleNavFor({
        designation: this.designation,
        tier: this.tier,
        portalKey: this.portal ? this.portal.key : null,
        tierAtLeast: this.tierAtLeast,
      });
    },
    portalGlyph() {
      return { air: "✈", sea: "⚓", road: "🚚" }[this.portal && this.portal.scope] || "●";
    },
  },
};
</script>

<style>
/* Structure only — no visual design. Everything reads from the tokens in
   resources/css/app.css, so restyling later is changing token values, not markup. */
.fx-shell { display: flex; min-height: 100vh; background: var(--bg-canvas); }

.fx-rail {
  width: 208px; flex: 0 0 208px;
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
  border-top: 3px solid var(--portal-accent); /* §8.4 portal accent */
  display: flex; flex-direction: column;
  transition: width var(--motion-base) var(--motion-ease);
}
.fx-rail.is-collapsed { width: 56px; flex-basis: 56px; }
.fx-rail.is-collapsed .fx-rail__label { display: none; }

.fx-rail__brand {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
}
.fx-rail__mark { font-weight: 700; letter-spacing: .02em; color: var(--portal-accent); }
.fx-rail__toggle {
  background: none; border: 0; cursor: pointer;
  color: var(--text-secondary); padding: var(--space-1);
}

.fx-rail__nav { padding: var(--space-2) 0; display: flex; flex-direction: column; }
.fx-rail__item {
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  color: var(--text-secondary); text-decoration: none;
  font-size: .875rem; line-height: 1.4;
  border-left: 2px solid transparent;
}
.fx-rail__item:hover { background: var(--bg-sunken); color: var(--text-primary); }
.fx-rail__item.router-link-active {
  color: var(--text-primary); font-weight: 600;
  border-left-color: var(--portal-accent);
  background: var(--bg-sunken);
}
/* §1.3 never signal with colour alone — the lock glyph carries the meaning, the
   dimming only reinforces it. */
.fx-rail__item.is-locked { color: var(--text-disabled); }

.fx-body { flex: 1 1 auto; display: flex; flex-direction: column; min-width: 0; }

.fx-header {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.fx-header__spacer { flex: 1 1 auto; }
.fx-header__who { color: var(--text-secondary); font-size: .8125rem; text-transform: capitalize; }

.fx-portal-chip {
  display: inline-flex; align-items: center; gap: var(--space-1);
  padding: 2px var(--space-2);
  border: 1px solid var(--portal-accent);
  border-radius: var(--radius-sm);
  color: var(--portal-accent);
  font-size: .75rem; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
}

.fx-main { flex: 1 1 auto; padding: var(--space-5); min-width: 0; }

/* §7.1 — below --bp-sm (768px) the product is read-only by design. A 12-tab customs
   form with 35-character IATA limits cannot be completed accurately on a phone, and a
   mis-keyed manifest is a rejected filing. */
@media (max-width: 767px) {
  .fx-rail { position: fixed; z-index: 20; height: 100%; width: 56px; flex-basis: 56px; }
  .fx-rail .fx-rail__label { display: none; }
  .fx-body { margin-left: 56px; }
  .fx-main { padding: var(--space-3); }
}
</style>
