<template>
  <div class="skeleton-table">
    <div class="skeleton-header">
      <div v-for="n in columns" :key="'h'+n" class="skeleton-bar header-bar"></div>
    </div>
    <div class="skeleton-body">
      <div v-for="row in rows" :key="'r'+row" class="skeleton-row">
        <div v-for="col in columns" :key="'c'+col" class="skeleton-bar body-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SkeletonTable",
  props: {
    rows: {
      type: Number,
      default: 5
    },
    columns: {
      type: Number,
      default: 4
    }
  }
};
</script>

<style scoped>
.skeleton-table {
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  padding: 1rem;
}

.skeleton-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.skeleton-bar {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  flex: 1;
}

.header-bar {
  height: 24px;
  background: #e8e8e8;
}

.body-bar {
  height: 18px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
