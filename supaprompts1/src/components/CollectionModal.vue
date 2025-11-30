<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  collection: Object
})

const emit = defineEmits(['close', 'save'])

const name = ref('')

watch(() => props.show, (newVal) => {
  if (newVal) {
    name.value = props.collection?.name || ''
  }
})

function handleSubmit() {
  if (name.value.trim()) {
    emit('save', { name: name.value.trim() })
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop fade show"></div>
    <div
      v-if="show"
      class="modal fade show d-block"
      tabindex="-1"
      @click.self="emit('close')"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              {{ collection ? 'Edit Collection' : 'New Collection' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="emit('close')"
            ></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Collection Name</label>
                <input
                  v-model="name"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="e.g., Writing, Coding, Marketing..."
                  required
                  autofocus
                >
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!name.trim()"
              >
                <i class="bi bi-check-lg me-2"></i>
                {{ collection ? 'Save Changes' : 'Create Collection' }}
              </button>
            </div>
          </form>
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

.form-control-lg {
  border-radius: 0.75rem;
}

.btn {
  border-radius: 0.5rem;
}
</style>
