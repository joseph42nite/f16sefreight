<template>
  <div :class="['section-header', textAlignClass, marginClass]">
    <span v-if="eyebrow" class="section-eyebrow">{{ eyebrow }}</span>
    <component :is="tag" :id="id" class="section-title">
      <slot name="title">{{ title }}</slot>
    </component>
    <p v-if="subtitle || $slots.subtitle" class="section-subtitle mt-4">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "SectionHeader",
  props: {
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    tag: { type: String, default: "h2" },
    id: { type: String, default: null },
    align: { type: String, default: "center" }, // left, center, right
    marginBottom: { type: String, default: "16" }
  },
  computed: {
    textAlignClass() {
      return `text-${this.align}`;
    },
    marginClass() {
      return `mb-${this.marginBottom}`;
    }
  }
};
</script>
