<template>
  <b-button 
    :to="to" 
    :href="href" 
    class="hero-btn" 
    :class="variantClass"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
    :disabled="disabled"
  >
    <span><slot></slot></span>
    <div class="btn-icon">
        <b-icon :icon="icon" aria-hidden="true"></b-icon>
    </div>
  </b-button>
</template>

<script>
export default {
  name: "HeroButton",
  props: {
    to: { type: String, default: null },
    href: { type: String, default: null },
    icon: { type: String, default: "arrow-right" },
    ariaLabel: { type: String, default: "Action button" },
    variant: { type: String, default: "blue" }, // blue, white
    disabled: { type: Boolean, default: false }
  },
  computed: {
    variantClass() {
      return {
        'is-white': this.variant === 'white',
        'hero-btn-large-white': this.variant === 'large-white'
      };
    }
  }
};
</script>


