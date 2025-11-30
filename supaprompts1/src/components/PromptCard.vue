<script setup>
import { computed } from 'vue'
import { usePromptsStore } from '@/stores/prompts'
import { useCollectionsStore } from '@/stores/collections'

const props = defineProps({
  prompt: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'copy', 'toggle-favorite', 'quick-use'])

const promptsStore = usePromptsStore()
const collectionsStore = useCollectionsStore()

const variables = computed(() => promptsStore.parseVariables(props.prompt.template))
const hasVariables = computed(() => variables.value.length > 0)

const collectionName = computed(() => {
  if (!props.prompt.collection_id) return null
  const collection = collectionsStore.collections.find(c => c.id === props.prompt.collection_id)
  return collection?.name
})

const templatePreview = computed(() => {
  const maxLength = 150
  const template = props.prompt.template || ''
  if (template.length <= maxLength) return template
  return template.substring(0, maxLength) + '...'
})

function handleCopyClick() {
  emit('copy', props.prompt)
}
</script>

<template>
  <div class="prompt-card card h-100">
    <div class="card-body d-flex flex-column">
      <!-- Header -->
      <div class="card-header-custom d-flex align-items-start justify-content-between mb-3">
        <div class="flex-grow-1 min-w-0">
          <h5 class="card-title mb-1">{{ prompt.title }}</h5>
          <p v-if="prompt.description" class="card-subtitle text-muted small mb-0">
            {{ prompt.description }}
          </p>
        </div>
        <button
          class="btn btn-link favorite-btn p-1"
          :class="{ 'text-warning': prompt.is_favorite }"
          @click="emit('toggle-favorite')"
          :title="prompt.is_favorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <i class="bi" :class="prompt.is_favorite ? 'bi-star-fill' : 'bi-star'"></i>
        </button>
      </div>

      <!-- Template Preview -->
      <div class="template-preview flex-grow-1 mb-3">
        <pre class="mb-0">{{ templatePreview }}</pre>
      </div>

      <!-- Variables Badge -->
      <div v-if="hasVariables" class="variables-info mb-3">
        <span class="badge bg-info-subtle text-info">
          <i class="bi bi-input-cursor me-1"></i>
          {{ variables.length }} variable{{ variables.length > 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Tags -->
      <div v-if="prompt.tags?.length" class="tags mb-3">
        <span
          v-for="tag in prompt.tags.slice(0, 4)"
          :key="tag"
          class="badge bg-secondary me-1 mb-1"
        >
          {{ tag }}
        </span>
        <span v-if="prompt.tags.length > 4" class="badge bg-secondary">
          +{{ prompt.tags.length - 4 }}
        </span>
      </div>

      <!-- Collection & Stats -->
      <div class="meta-info d-flex align-items-center justify-content-between text-muted small mb-3">
        <span v-if="collectionName" class="collection-badge">
          <i class="bi bi-folder me-1"></i>
          {{ collectionName }}
        </span>
        <span v-else></span>
        <span class="copy-count">
          <i class="bi bi-clipboard me-1"></i>
          {{ prompt.copied_count || 0 }}
        </span>
      </div>

      <!-- Actions -->
      <div class="card-actions d-flex gap-2">
        <button
          class="btn btn-primary flex-grow-1"
          @click="handleCopyClick"
        >
          <i class="bi me-2" :class="hasVariables ? 'bi-lightning' : 'bi-clipboard'"></i>
          {{ hasVariables ? 'Quick Use' : 'Copy' }}
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="emit('edit', prompt)"
          title="Edit"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button
          class="btn btn-outline-danger"
          @click="emit('delete', prompt)"
          title="Delete"
        >
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prompt-card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.prompt-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.favorite-btn {
  color: var(--bs-secondary-color);
  transition: color 0.15s ease;
}

.favorite-btn:hover {
  color: var(--bs-warning);
}

.favorite-btn.text-warning {
  color: var(--bs-warning) !important;
}

.template-preview {
  background: var(--bs-tertiary-bg);
  border-radius: 0.75rem;
  padding: 0.75rem;
  overflow: hidden;
}

.template-preview pre {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--bs-body-color);
  margin: 0;
}

.tags .badge {
  font-weight: 500;
  font-size: 0.75rem;
}

.meta-info {
  font-size: 0.8125rem;
}

.collection-badge {
  background: var(--bs-tertiary-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.card-actions .btn {
  border-radius: 0.75rem;
}
</style>
