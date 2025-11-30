<script setup>
defineProps({
  icon: {
    type: String,
    default: 'bi-inbox'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="empty-state text-center py-5">
    <div class="empty-icon mb-4">
      <i class="bi" :class="icon"></i>
    </div>
    <h3 class="empty-title fw-bold mb-2">{{ title }}</h3>
    <p v-if="description" class="empty-description text-muted mb-4">
      {{ description }}
    </p>
    <div class="empty-actions">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  color: var(--bs-secondary-color);
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  color: var(--bs-body-color);
}

.empty-description {
  font-size: 1rem;
}
</style>
