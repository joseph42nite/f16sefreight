<template>
  <!--
    Type a name, pick from the matches (user, 2026-09-16). A plain dropdown of every colleague stops working once a
    branch has more than a handful of people.
  -->
  <div class="fx-picker" @keydown.down.prevent="move(1)" @keydown.up.prevent="move(-1)"
       @keydown.enter.prevent="choose(matches[active])" @keydown.esc="close">
    <input
      ref="input"
      v-model="query"
      class="fx-input fx-picker__input"
      type="text"
      role="combobox"
      :aria-expanded="String(open)"
      :aria-label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="open = true"
      @input="open = true; active = 0"
      @blur="close"
    />
    <ul v-if="open" class="fx-picker__list" role="listbox">
      <li
        v-for="(o, i) in matches"
        :key="o.id"
        role="option"
        class="fx-picker__option"
        :class="{ 'is-active': i === active }"
        :aria-selected="String(i === active)"
        @mousedown.prevent="choose(o)"
      >
        {{ o.name }}<span v-if="o.email" class="fx-muted"> · {{ o.email }}</span>
      </li>
      <li v-if="!matches.length" class="fx-picker__empty fx-muted">No one matches “{{ query }}”.</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StaffPicker",
  props: {
    /** [{ id, name, email? }] */
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "Type a name…" },
    label: { type: String, default: "Choose a colleague" },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({ query: "", open: false, active: 0 }),
  computed: {
    /** Every word typed must appear in the name or the email, in any order. */
    matches() {
      const words = this.query.toLowerCase().split(/\s+/).filter(Boolean);
      return this.options.filter((o) => {
        const text = (o.name + " " + (o.email || "")).toLowerCase();
        return words.every((w) => text.indexOf(w) !== -1);
      });
    },
  },
  methods: {
    move(step) {
      if (!this.open) { this.open = true; return; }
      const n = this.matches.length;
      if (n) this.active = (this.active + step + n) % n;
    },
    choose(option) {
      if (!option) return;
      this.$emit("select", option);
      this.query = "";
      this.open = false;
      this.$refs.input.blur();
    },
    close() {
      this.open = false;
      this.active = 0;
    },
  },
};
</script>

<style>
.fx-picker { position: relative; min-width: 12rem; }
.fx-picker__input { width: 100%; }
.fx-picker__list { position: absolute; z-index: 40; left: 0; right: 0; top: calc(100% + 2px); max-height: 16rem; overflow-y: auto;
  margin: 0; padding: var(--space-1) 0; list-style: none; background: var(--bg-surface); border: 1px solid var(--border);
  border-radius: var(--radius-sm); box-shadow: 0 6px 20px rgba(0, 0, 0, .12); }
.fx-picker__option { padding: var(--space-2) var(--space-3); font-size: .8125rem; cursor: pointer; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; }
.fx-picker__option.is-active, .fx-picker__option:hover { background: var(--bg-sunken); }
.fx-picker__empty { padding: var(--space-2) var(--space-3); font-size: .8125rem; }
</style>
