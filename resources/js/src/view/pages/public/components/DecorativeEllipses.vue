<template>
  <div class="decorative-ellipses d-none d-lg-block">
    <div class="ellipse ellipse-tl"></div>
    <div class="ellipse ellipse-tr"></div>
    <div class="ellipse ellipse-br"></div>
    <div v-if="showMid" class="ellipse ellipse-mid"></div>
  </div>
</template>

<script>
export default {
  name: "DecorativeEllipses",
  props: {
    showMid: {
      type: Boolean,
      default: false
    }
  }
};
</script>
