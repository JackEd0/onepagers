<script setup>
defineProps({
  show: Boolean,
  itemName: String,
  itemType: {
    type: String,
    default: 'item'
  }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop fade show"></div>
    <div 
      v-if="show" 
      class="modal fade show d-block" 
      tabindex="-1"
      @click.self="emit('cancel')"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold text-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Delete {{ itemType }}?
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="emit('cancel')"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              Are you sure you want to delete 
              <strong>"{{ itemName }}"</strong>? 
              This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              @click="emit('cancel')"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-danger"
              @click="emit('confirm')"
            >
              <i class="bi bi-trash me-2"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-content {
  border-radius: 1rem;
  border: none;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175);
}

.btn {
  border-radius: 0.5rem;
}
</style>
