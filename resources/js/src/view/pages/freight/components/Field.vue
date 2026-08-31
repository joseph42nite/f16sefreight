<template>
  <label class="fx-field">
    <span class="fx-field__label">{{ label }}</span>
    <input
      :value="value"
      :type="type"
      :disabled="disabled"
      :class="['fx-input', mono ? 'identifier' : '']"
      v-bind="$attrs"
      @input="$emit('input', type === 'number' ? toNumber($event.target.value) : $event.target.value)"
    />
    <!-- Hints carry the CONSTRAINT, not encouragement: "≤ 20 chars (ICEGATE)" is
         actionable where "keep it short" is not. -->
    <span v-if="hint" class="fx-field__hint">{{ hint }}</span>
  </label>
</template>

<script>
export default {
  name: "Field",
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: "" },
    label: { type: String, required: true },
    type: { type: String, default: "text" },
    disabled: { type: Boolean, default: false },
    mono: { type: Boolean, default: false },
    hint: { type: String, default: null },
  },
  methods: {
    /* An empty numeric field is NULL, not 0 — §4.1. "Not recorded" and "weighs
       nothing" are different claims on a customs document. */
    toNumber(v) {
      return v === "" ? null : Number(v);
    },
  },
};
</script>
