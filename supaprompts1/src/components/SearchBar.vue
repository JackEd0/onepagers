<script setup>
import { ref, computed } from 'vue'
import { usePromptsStore } from '@/stores/prompts'

const emit = defineEmits(['new-prompt'])

const promptsStore = usePromptsStore()
const searchInput = ref(null)

const localSearch = ref(promptsStore.searchQuery)

function handleSearch() {
  promptsStore.setSearchQuery(localSearch.value)
}

function clearSearch() {
  localSearch.value = ''
  promptsStore.setSearchQuery('')
}
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="search-bar">
      <div class="search-input-group">
        <i class="bi bi-search search-icon"></i>
        <input
          ref="searchInput"
          v-model="localSearch"
          type="text"
          class="form-control search-input"
          placeholder="Search prompts... (Ctrl+K)"
          @input="handleSearch"
        >
        <button
          v-if="localSearch"
          class="btn btn-link search-clear"
          @click="clearSearch"
        >
          <i class="bi bi-x-lg"></i>
        </button>
        <kbd class="search-shortcut d-none d-md-inline">⌘K</kbd>
      </div>

      <button
        class="btn btn-primary btn-new-prompt"
        @click="emit('new-prompt')"
      >
        <i class="bi bi-plus-lg me-2"></i>
        <span class="d-none d-sm-inline">New Prompt</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input-group {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  color: var(--bs-secondary-color);
  font-size: 1.25rem;
  pointer-events: none;
}

.search-input {
  padding: 1rem 1rem 1rem 3.5rem;
  font-size: 1.125rem;
  border-radius: 1rem;
  border: 2px solid var(--bs-border-color);
  background: var(--bs-body-bg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.15);
}

.search-input::placeholder {
  color: var(--bs-secondary-color);
}

.search-clear {
  position: absolute;
  right: 4rem;
  color: var(--bs-secondary-color);
  padding: 0.25rem 0.5rem;
}

.search-clear:hover {
  color: var(--bs-body-color);
}

.search-shortcut {
  position: absolute;
  right: 1rem;
  background: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 0.375rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  color: var(--bs-secondary-color);
}

.btn-new-prompt {
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 576px) {
  .search-bar {
    flex-direction: column;
  }

  .search-input-group {
    width: 100%;
  }

  .btn-new-prompt {
    width: 100%;
  }
}
</style>
