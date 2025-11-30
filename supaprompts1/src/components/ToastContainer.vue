<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const toasts = ref([])
let toastId = 0

function showToast(event) {
  const { message, type = 'info' } = event.detail
  const id = ++toastId
  
  toasts.value.push({ id, message, type })
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

function getToastClass(type) {
  switch (type) {
    case 'success': return 'bg-success text-white'
    case 'error': return 'bg-danger text-white'
    case 'warning': return 'bg-warning text-dark'
    default: return 'bg-info text-white'
  }
}

function getToastIcon(type) {
  switch (type) {
    case 'success': return 'bi-check-circle-fill'
    case 'error': return 'bi-x-circle-fill'
    case 'warning': return 'bi-exclamation-triangle-fill'
    default: return 'bi-info-circle-fill'
  }
}

onMounted(() => {
  window.addEventListener('show-toast', showToast)
})

onUnmounted(() => {
  window.removeEventListener('show-toast', showToast)
})
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100;">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show"
      :class="getToastClass(toast.type)"
      role="alert"
    >
      <div class="toast-body d-flex align-items-center">
        <i class="bi me-2" :class="getToastIcon(toast.type)"></i>
        <span class="flex-grow-1">{{ toast.message }}</span>
        <button 
          type="button" 
          class="btn-close btn-close-white ms-2" 
          @click="removeToast(toast.id)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast {
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
