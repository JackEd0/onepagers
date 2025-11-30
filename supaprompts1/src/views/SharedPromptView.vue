<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePromptsStore } from '@/stores/prompts'
import EmptyState from '@/components/EmptyState.vue'

const route = useRoute()
const promptsStore = usePromptsStore()

const prompt = ref(null)
const loading = ref(true)
const error = ref(null)
const variableValues = ref({})
const copied = ref(false)

const variables = computed(() => {
  if (!prompt.value) return []
  return promptsStore.parseVariables(prompt.value.template)
})

const hasVariables = computed(() => variables.value.length > 0)

const finalPrompt = computed(() => {
  if (!prompt.value) return ''
  return promptsStore.replaceVariables(prompt.value.template, variableValues.value)
})

async function fetchPrompt() {
  loading.value = true
  error.value = null
  
  try {
    const id = route.params.id
    prompt.value = await promptsStore.fetchPromptById(id)
    
    if (!prompt.value) {
      error.value = 'Prompt not found'
    } else {
      // Initialize variable values
      variables.value.forEach(v => {
        variableValues.value[v] = ''
      })
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function copyPrompt() {
  const textToCopy = hasVariables.value ? finalPrompt.value : prompt.value.template
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

async function addToMyPrompts() {
  // This would require authentication in the future
  // For now, just show a message
  window.dispatchEvent(new CustomEvent('show-toast', { 
    detail: { message: 'Connect to your Supabase to save this prompt!', type: 'info' }
  }))
}

onMounted(fetchPrompt)
</script>

<template>
  <div class="shared-prompt-view">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Error -->
          <EmptyState
            v-else-if="error"
            icon="bi-exclamation-triangle"
            title="Prompt Not Found"
            :description="error"
          >
            <router-link to="/" class="btn btn-primary">
              <i class="bi bi-house me-2"></i>
              Go Home
            </router-link>
          </EmptyState>

          <!-- Prompt -->
          <template v-else-if="prompt">
            <div class="card border-0 shadow-lg">
              <div class="card-body p-4 p-lg-5">
                <!-- Header -->
                <div class="d-flex align-items-start justify-content-between mb-4">
                  <div>
                    <h1 class="h3 fw-bold mb-2">{{ prompt.title }}</h1>
                    <p v-if="prompt.description" class="text-muted mb-0">
                      {{ prompt.description }}
                    </p>
                  </div>
                  <span v-if="prompt.is_favorite" class="badge bg-warning text-dark">
                    <i class="bi bi-star-fill"></i> Favorite
                  </span>
                </div>

                <!-- Tags -->
                <div v-if="prompt.tags?.length" class="mb-4">
                  <span 
                    v-for="tag in prompt.tags" 
                    :key="tag"
                    class="badge bg-secondary me-2"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Variables Form -->
                <div v-if="hasVariables" class="mb-4">
                  <h5 class="fw-semibold mb-3">
                    <i class="bi bi-input-cursor me-2"></i>
                    Fill in Variables
                  </h5>
                  <div class="row g-3">
                    <div 
                      v-for="variable in variables" 
                      :key="variable"
                      class="col-12 col-md-6"
                    >
                      <label class="form-label">{{ variable }}</label>
                      <input 
                        v-model="variableValues[variable]"
                        type="text"
                        class="form-control"
                        :placeholder="`Enter ${variable}...`"
                      >
                    </div>
                  </div>
                </div>

                <!-- Template Preview -->
                <div class="mb-4">
                  <h5 class="fw-semibold mb-3">
                    <i class="bi bi-file-text me-2"></i>
                    {{ hasVariables ? 'Preview' : 'Template' }}
                  </h5>
                  <div class="bg-light rounded-3 p-4">
                    <pre class="mb-0 text-wrap">{{ hasVariables ? finalPrompt : prompt.template }}</pre>
                  </div>
                </div>

                <!-- Actions -->
                <div class="d-flex gap-2 flex-wrap">
                  <button 
                    class="btn btn-primary btn-lg"
                    @click="copyPrompt"
                  >
                    <i class="bi me-2" :class="copied ? 'bi-check-lg' : 'bi-clipboard'"></i>
                    {{ copied ? 'Copied!' : 'Copy Prompt' }}
                  </button>
                  <button 
                    class="btn btn-outline-primary btn-lg"
                    @click="addToMyPrompts"
                  >
                    <i class="bi bi-plus-lg me-2"></i>
                    Add to My Prompts
                  </button>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="text-center mt-4 text-muted small">
              <span class="me-3">
                <i class="bi bi-clipboard me-1"></i>
                {{ prompt.copied_count || 0 }} copies
              </span>
              <span>
                <i class="bi bi-calendar me-1"></i>
                Created {{ new Date(prompt.created_at).toLocaleDateString() }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shared-prompt-view {
  padding: 2rem 0;
}

.card {
  border-radius: 1.5rem;
}

pre {
  font-family: inherit;
  white-space: pre-wrap;
  word-break: break-word;
}

.btn-lg {
  border-radius: 0.75rem;
}
</style>
