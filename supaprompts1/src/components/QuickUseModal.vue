<script setup>
import { ref, watch, computed } from 'vue'
import { usePromptsStore } from '@/stores/prompts'

const props = defineProps({
  show: Boolean,
  prompt: Object
})

const emit = defineEmits(['close', 'copy'])

const promptsStore = usePromptsStore()

const variableValues = ref({})

const variables = computed(() => {
  if (!props.prompt) return []
  return promptsStore.parseVariables(props.prompt.template)
})

const finalPrompt = computed(() => {
  if (!props.prompt) return ''
  return promptsStore.replaceVariables(props.prompt.template, variableValues.value)
})

const allFilled = computed(() => {
  return variables.value.every(v => variableValues.value[v]?.trim())
})

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal && props.prompt) {
    variableValues.value = {}
    variables.value.forEach(v => {
      variableValues.value[v] = ''
    })
  }
})

function handleCopy() {
  emit('copy', finalPrompt.value, props.prompt?.id)
  emit('close')
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
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-lightning-charge me-2"></i>
              Quick Use: {{ prompt?.title }}
            </h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="emit('close')"
            ></button>
          </div>
          <div class="modal-body">
            <!-- Variables Form -->
            <div class="variables-form mb-4">
              <h6 class="fw-semibold mb-3">
                <i class="bi bi-input-cursor me-2"></i>
                Fill in the variables
              </h6>
              <div class="row g-3">
                <div 
                  v-for="variable in variables" 
                  :key="variable"
                  class="col-12 col-md-6"
                >
                  <label class="form-label fw-medium">{{ variable }}</label>
                  <input 
                    v-model="variableValues[variable]"
                    type="text"
                    class="form-control"
                    :placeholder="`Enter ${variable}...`"
                  >
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div class="preview-section">
              <h6 class="fw-semibold mb-3">
                <i class="bi bi-eye me-2"></i>
                Preview
              </h6>
              <div class="preview-content">
                <pre class="mb-0">{{ finalPrompt }}</pre>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button 
              type="button" 
              class="btn btn-outline-secondary btn-lg"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-primary btn-lg"
              @click="handleCopy"
              :disabled="!allFilled"
            >
              <i class="bi bi-clipboard me-2"></i>
              Copy to Clipboard
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

.form-control {
  border-radius: 0.75rem;
}

.btn-lg {
  border-radius: 0.75rem;
}

.preview-content {
  background: var(--bs-tertiary-bg);
  border-radius: 0.75rem;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.preview-content pre {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--bs-body-color);
  margin: 0;
}
</style>
