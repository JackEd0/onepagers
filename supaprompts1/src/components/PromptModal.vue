<script setup>
import { ref, watch, computed } from 'vue'
import { useCollectionsStore } from '@/stores/collections'

const props = defineProps({
  show: Boolean,
  prompt: Object
})

const emit = defineEmits(['close', 'save'])

const collectionsStore = useCollectionsStore()

// Form state
const title = ref('')
const template = ref('')
const description = ref('')
const collectionId = ref(null)
const tagsInput = ref('')
const tags = ref([])
const isFavorite = ref(false)

const isEditing = computed(() => !!props.prompt)

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.prompt) {
      // Edit mode
      title.value = props.prompt.title || ''
      template.value = props.prompt.template || ''
      description.value = props.prompt.description || ''
      collectionId.value = props.prompt.collection_id || null
      tags.value = props.prompt.tags || []
      isFavorite.value = props.prompt.is_favorite || false
    } else {
      // Create mode
      title.value = ''
      template.value = ''
      description.value = ''
      collectionId.value = collectionsStore.activeCollectionId
      tags.value = []
      isFavorite.value = false
    }
    tagsInput.value = ''
  }
})

function addTag() {
  const tag = tagsInput.value.trim().toLowerCase()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
  }
  tagsInput.value = ''
}

function removeTag(tag) {
  tags.value = tags.value.filter(t => t !== tag)
}

function handleTagKeydown(e) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}

function handleSubmit() {
  if (!title.value.trim() || !template.value.trim()) return

  emit('save', {
    title: title.value.trim(),
    template: template.value.trim(),
    description: description.value.trim() || null,
    collection_id: collectionId.value || null,
    tags: tags.value,
    is_favorite: isFavorite.value
  })
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
              <i class="bi me-2" :class="isEditing ? 'bi-pencil' : 'bi-plus-lg'"></i>
              {{ isEditing ? 'Edit Prompt' : 'New Prompt' }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="emit('close')"
            ></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <!-- Title -->
              <div class="mb-3">
                <label class="form-label fw-medium">Title *</label>
                <input
                  v-model="title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="e.g., Blog Post Outline Generator"
                  required
                >
              </div>

              <!-- Template -->
              <div class="mb-3">
                <label class="form-label fw-medium">
                  Template *
                  <span class="text-muted fw-normal ms-2">
                    Use <code>{{variable}}</code> for placeholders
                  </span>
                </label>
                <textarea
                  v-model="template"
                  class="form-control"
                  rows="8"
                  placeholder="Write a blog post outline about {{topic}} for {{audience}}..."
                  required
                ></textarea>
              </div>

              <!-- Description -->
              <div class="mb-3">
                <label class="form-label fw-medium">Description</label>
                <input
                  v-model="description"
                  type="text"
                  class="form-control"
                  placeholder="Brief description of what this prompt does..."
                >
              </div>

              <!-- Collection -->
              <div class="mb-3">
                <label class="form-label fw-medium">Collection</label>
                <select v-model="collectionId" class="form-select">
                  <option :value="null">No Collection</option>
                  <option
                    v-for="collection in collectionsStore.sortedCollections"
                    :key="collection.id"
                    :value="collection.id"
                  >
                    {{ collection.name }}
                  </option>
                </select>
              </div>

              <!-- Tags -->
              <div class="mb-3">
                <label class="form-label fw-medium">Tags</label>
                <div class="tags-input-wrapper">
                  <div class="tags-display mb-2" v-if="tags.length">
                    <span
                      v-for="tag in tags"
                      :key="tag"
                      class="badge bg-primary me-1 mb-1"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        class="btn-close btn-close-white ms-1"
                        style="font-size: 0.5rem;"
                        @click="removeTag(tag)"
                      ></button>
                    </span>
                  </div>
                  <input
                    v-model="tagsInput"
                    type="text"
                    class="form-control"
                    placeholder="Type a tag and press Enter..."
                    @keydown="handleTagKeydown"
                    @blur="addTag"
                  >
                </div>
              </div>

              <!-- Favorite -->
              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="isFavorite"
                    type="checkbox"
                    class="form-check-input"
                    id="favoriteCheck"
                  >
                  <label class="form-check-label" for="favoriteCheck">
                    <i class="bi bi-star-fill text-warning me-1"></i>
                    Mark as favorite
                  </label>
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
                type="submit"
                class="btn btn-primary btn-lg"
                :disabled="!title.trim() || !template.trim()"
              >
                <i class="bi bi-check-lg me-2"></i>
                {{ isEditing ? 'Save Changes' : 'Create Prompt' }}
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

.form-control,
.form-select {
  border-radius: 0.75rem;
}

.form-control-lg {
  font-size: 1.125rem;
}

textarea.form-control {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 0.9rem;
}

.btn-lg {
  border-radius: 0.75rem;
}

code {
  background: var(--bs-tertiary-bg);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.tags-display .badge {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
