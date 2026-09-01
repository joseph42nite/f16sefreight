<template>
  <!--
    The drawer — ui_ux_guide.md §5.4.

    ⚠️ NOT A MODAL. §5.5 draws the line by DURATION of work, not by importance:
    a popover is <= 3 inputs, a modal is a blocking decision, and the drawer is
    SUSTAINED PARALLEL WORK against a record — verifying a document while reading
    the email that carried it, or editing a cost sheet while the register stays
    visible behind. That is why the page underneath is never dimmed away and never
    inert: the accountant is meant to keep referring to it.
  -->
  <transition name="fx-drawer">
    <aside
      v-if="open"
      ref="panel"
      class="fx-drawer"
      role="dialog"
      aria-modal="false"
      :aria-label="title"
      tabindex="-1"
      @keydown.esc.stop="close"
      @keydown.tab="trapFocus"
    >
      <header class="fx-drawer__head">
        <div class="fx-drawer__titles">
          <h2 class="fx-drawer__title">{{ title }}</h2>
          <p v-if="subtitle" class="fx-drawer__sub">{{ subtitle }}</p>
        </div>

        <button ref="closer" class="fx-btn fx-btn--ghost" aria-label="Close" @click="close">✕</button>
      </header>

      <!--
        Facts that are ALWAYS true of the record, shown rather than tabbed. A tab that
        holds two read-only fields costs a click to reveal something that never changes
        while the drawer is open — and the reader has to remember to look. The header is
        where a record identifies itself.
      -->
      <div v-if="$slots.meta" class="fx-drawer__meta">
        <slot name="meta" />
      </div>

      <!--
        §5.4 the tab bar lives in the HEADER, not in the body, so it stays put while
        the body scrolls. A tab strip that scrolls away leaves no way back.
      -->
      <nav v-if="tabs.length > 1" class="fx-drawer__tabs" role="tablist" :aria-label="title + ' sections'">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="fx-drawer__tab"
          :class="{ 'is-active': t.key === activeTab }"
          role="tab"
          :aria-selected="String(t.key === activeTab)"
          @click="$emit('tab', t.key)"
        >{{ t.label }}</button>
      </nav>

      <div class="fx-drawer__body">
        <slot />
      </div>

      <!--
        §10.4 the footer is STICKY and holds the commit actions. A [Post to Ledger]
        button that scrolls out of sight on a long journal is a button that gets
        clicked from memory rather than from reading.
      -->
      <footer v-if="$slots.footer" class="fx-drawer__foot">
        <slot name="footer" />
      </footer>
    </aside>
  </transition>
</template>

<script>
/* Selector for what can hold focus — used by the tab trap below. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default {
  name: "FxDrawer",
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    subtitle: { type: String, default: null },
    /* [{ key, label }] — the header tab strip. One tab renders no strip at all. */
    tabs: { type: Array, default: () => [] },
    activeTab: { type: String, default: null },
  },
  data: () => ({ returnFocusTo: null }),
  watch: {
    open(isOpen) {
      if (isOpen) {
        /* §1305 — remember the trigger so focus can be RESTORED to it on close.
           Dropping focus back to <body> loses a keyboard user their place in the
           table entirely, and they have to tab from the top to get back. */
        this.returnFocusTo = document.activeElement;
        this.$nextTick(() => this.$refs.panel && this.$refs.panel.focus());
      } else if (this.returnFocusTo && this.returnFocusTo.focus) {
        this.returnFocusTo.focus();
        this.returnFocusTo = null;
      }
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    /**
     * Keep Tab inside the panel while it is open.
     *
     * Deliberately a CYCLE, not a lock: the drawer is non-modal, so the page behind
     * stays usable with the mouse — but tabbing blindly out of an open panel into a
     * table of 50 rows is how people lose the record they were working on.
     */
    trapFocus(e) {
      const items = Array.prototype.filter.call(
        this.$refs.panel.querySelectorAll(FOCUSABLE),
        (el) => el.offsetParent !== null
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
  },
};
</script>
