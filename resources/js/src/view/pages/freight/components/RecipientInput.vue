<template>
  <div class="fx-recipients">
    <input
      :id="inputId"
      ref="input"
      :value="value"
      class="fx-input"
      :placeholder="placeholder"
      autocomplete="off"
      role="combobox"
      :aria-expanded="open ? 'true' : 'false'"
      aria-autocomplete="list"
      @input="onInput($event.target.value)"
      @keydown.down.prevent="move(1)"
      @keydown.up.prevent="move(-1)"
      @keydown.enter="pickActive($event)"
      @keydown.esc="open = false"
      @blur="open = false"
    />
    <ul v-if="open && ranked.length" class="fx-recipients__list" role="listbox">
      <li
        v-for="(s, i) in ranked"
        :key="s.email"
        role="option"
        :aria-selected="i === active ? 'true' : 'false'"
        :class="{ 'is-active': i === active }"
        @mousedown.prevent="pick(s)"
      >
        <strong>{{ s.name || s.email }}</strong>
        <span class="fx-muted"> {{ s.name ? s.email : "" }}{{ s.kind === "colleague" ? " · colleague" : "" }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import ApiService from "@/core/services/api.service";

const PICKS = "fx.recipientPicks";

/** What this person has picked before, and how often — kept in this browser only (owner, 2026-10-10). */
function picks() {
  try {
    return JSON.parse(window.localStorage.getItem(PICKS) || "{}") || {};
  } catch (e) {
    return {};
  }
}

/**
 * A To or CC box that suggests as you type (owner, 2026-10-10): "when I write @name it shows a small dropdown of the
 * saved options … otherwise they write the full email." The address being typed is the text after the last comma; a
 * leading @ is optional. Colleagues and people we have mailed come from the server, closest first; what this person
 * picks most is moved to the top. The box stays a plain comma-separated list, so typing a full address still works.
 */
export default {
  name: "RecipientInput",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "name or address, comma separated" },
    inputId: { type: String, default: null },
  },
  data: () => ({ suggestions: [], open: false, active: 0, timer: null, cache: {}, typed: null }),
  computed: {
    ranked() {
      const count = picks();

      return [...this.suggestions].sort((a, b) => (count[b.email] || 0) - (count[a.email] || 0));
    },
  },
  watch: {
    // The parent changed the box (a reply prefilled it, a send cleared it): that is now what it holds.
    value(v) {
      if (v !== this.typed) this.typed = null;
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    /** The address being typed: after the last comma, without a leading @. */
    current(text) {
      const part = String(text || "").split(/[,;]/).pop().trim();

      return part.replace(/^@/, "");
    },
    /** What the box holds: the last thing typed, until the parent sends a value back. */
    text() {
      return this.typed !== null ? this.typed : this.value;
    },
    onInput(text) {
      this.typed = text;
      this.$emit("input", text);
      clearTimeout(this.timer);

      const q = this.current(text);
      // A full address, or nothing typed yet: nothing to suggest.
      if (!q || q.includes("@")) {
        this.open = false;
        return;
      }

      this.timer = setTimeout(() => this.lookUp(q), 200);
    },
    lookUp(q) {
      const show = (list) => {
        if (this.current(this.text()) !== q) return;
        this.suggestions = list;
        this.active = 0;
        this.open = list.length > 0;
      };

      if (this.cache[q]) {
        show(this.cache[q]);
        return;
      }

      ApiService.query("/inbox/address-book", { params: { q } })
        .then(({ data }) => {
          this.cache[q] = data.suggestions || [];
          show(this.cache[q]);
        })
        .catch(() => { this.open = false; });
    },
    move(step) {
      if (!this.open) return;
      this.active = (this.active + step + this.ranked.length) % this.ranked.length;
    },
    pickActive(event) {
      if (!this.open || !this.ranked.length) return;
      event.preventDefault();
      this.pick(this.ranked[this.active]);
    },
    pick(suggestion) {
      const parts = String(this.text() || "").split(/[,;]/);
      parts.pop();
      const kept = parts.map((p) => p.trim()).filter(Boolean);
      this.typed = kept.concat(suggestion.email).join(", ") + ", ";
      this.$emit("input", this.typed);

      try {
        const count = picks();
        count[suggestion.email] = (count[suggestion.email] || 0) + 1;
        window.localStorage.setItem(PICKS, JSON.stringify(count));
      } catch (e) {
        // A browser that keeps nothing still suggests; it just does not remember.
      }

      this.open = false;
    },
  },
};
</script>

<style scoped>
.fx-recipients { position: relative; }
.fx-recipients__list {
  position: absolute; z-index: 20; left: 0; right: 0; top: 100%; margin: 2px 0 0; padding: 4px 0; list-style: none;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 6px 18px rgba(15, 23, 42, .12);
  max-height: 240px; overflow-y: auto;
}
.fx-recipients__list li { padding: 6px 10px; cursor: pointer; font-size: .8125rem; }
.fx-recipients__list li.is-active, .fx-recipients__list li:hover { background: #eef2ff; }
</style>
