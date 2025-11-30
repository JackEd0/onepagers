<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useCollectionsStore } from '@/stores/collections'
import { usePromptsStore } from '@/stores/prompts'
import SearchBar from '@/components/SearchBar.vue'
import PromptCard from '@/components/PromptCard.vue'
import PromptModal from '@/components/PromptModal.vue'
import QuickUseModal from '@/components/QuickUseModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'
import FilterBar from '@/components/FilterBar.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const collectionsStore = useCollectionsStore()
const promptsStore = usePromptsStore()

// Modal states
const showPromptModal = ref(false)
const editingPrompt = ref(null)
const showQuickUseModal = ref(false)
const quickUsePrompt = ref(null)
const showDeleteModal = ref(false)
const deletingPrompt = ref(null)

// Computed
const hasPrompts = computed(() => promptsStore.filteredPrompts.length > 0)
const isLoading = computed(() => promptsStore.loading || collectionsStore.loading)

// Prompt actions
function openNewPromptModal() {
  editingPrompt.value = null
  showPromptModal.value = true
}

function openEditPromptModal(prompt) {
  editingPrompt.value = prompt
  showPromptModal.value = true
}

function closePromptModal() {
  showPromptModal.value = false
  editingPrompt.value = null
}

async function handleSavePrompt(promptData) {
  if (editingPrompt.value) {
    await promptsStore.updatePrompt(editingPrompt.value.id, promptData)
  } else {
    await promptsStore.createPrompt(promptData)
  }
  closePromptModal()
}

// Quick use
function openQuickUse(prompt) {
  quickUsePrompt.value = prompt
  showQuickUseModal.value = true
}

function closeQuickUse() {
  showQuickUseModal.value = false
  quickUsePrompt.value = null
}

// Delete
function confirmDelete(prompt) {
  deletingPrompt.value = prompt
  showDeleteModal.value = true
}

async function handleDelete() {
  if (deletingPrompt.value) {
    await promptsStore.deletePrompt(deletingPrompt.value.id)
  }
  showDeleteModal.value = false
  deletingPrompt.value = null
}

function cancelDelete() {
  showDeleteModal.value = false
  deletingPrompt.value = null
}

// Copy prompt
async function handleCopy(prompt) {
  const variables = promptsStore.parseVariables(prompt.template)
  
  if (variables.length > 0) {
    openQuickUse(prompt)
  } else {
    await copyToClipboard(prompt.template, prompt.id)
  }
}

async function copyToClipboard(text, promptId = null) {
  try {
    await navigator.clipboard.writeText(text)
    if (promptId) {
      await promptsStore.incrementCopyCount(promptId)
    }
    // Show success toast (handled by ToastContainer)
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: 'Copied to clipboard!', type: 'success' }
    }))
  } catch (err) {
    console.error('Failed to copy:', err)
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: 'Failed to copy', type: 'error' }
    }))
  }
}

// Keyboard shortcuts
function handleKeydown(e) {
  // Ctrl+K or Ctrl+P to focus search
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'p')) {
    e.preventDefault()
    document.querySelector('.search-input')?.focus()
  }
  
  // Ctrl+N for new prompt
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault()
    openNewPromptModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="home-view">
    <!-- Not connected state -->
    <div v-if="!settingsStore.isConnected" class="not-connected">
      <EmptyState
        icon="bi-database-x"
        title="Not Connected"
        description="Connect to your Supabase instance to start managing your prompts."
      >
        <router-link to="/settings" class="btn btn-primary btn-lg">
          <i class="bi bi-gear me-2"></i>
          Configure Settings
        </router-link>
      </EmptyState>
    </div>

    <!-- Connected state -->
    <template v-else>
      <!-- Search Bar -->
      <SearchBar 
        class="mb-4"
        @new-prompt="openNewPromptModal"
      />

      <!-- Filter Bar -->
      <FilterBar class="mb-4" />

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Empty state -->
      <EmptyState
        v-else-if="!hasPrompts && !promptsStore.searchQuery"
        icon="bi-file-earmark-text"
        title="No Prompts Yet"
        description="Create your first prompt to get started!"
      >
        <button class="btn btn-primary btn-lg" @click="openNewPromptModal">
          <i class="bi bi-plus-lg me-2"></i>
          Create Prompt
        </button>
      </EmptyState>

      <!-- No search results -->
      <EmptyState
        v-else-if="!hasPrompts && promptsStore.searchQuery"
        icon="bi-search"
        title="No Results"
        description="Try a different search term or clear filters."
      >
        <button class="btn btn-outline-secondary" @click="promptsStore.clearFilters">
          <i class="bi bi-x-lg me-2"></i>
          Clear Filters
        </button>
      </EmptyState>

      <!-- Prompts grid -->
      <div v-else class="prompts-grid">
        <PromptCard
          v-for="prompt in promptsStore.filteredPrompts"
          :key="prompt.id"
          :prompt="prompt"
          @edit="openEditPromptModal"
          @delete="confirmDelete"
          @copy="handleCopy"
          @toggle-favorite="promptsStore.toggleFavorite(prompt.id)"
          @quick-use="openQuickUse"
        />
      </div>
    </template>

    <!-- Modals -->
    <PromptModal
      :show="showPromptModal"
      :prompt="editingPrompt"
      @close="closePromptModal"
      @save="handleSavePrompt"
    />

    <QuickUseModal
      :show="showQuickUseModal"
      :prompt="quickUsePrompt"
      @close="closeQuickUse"
      @copy="copyToClipboard"
    />

    <DeleteConfirmModal
      :show="showDeleteModal"
      :item-name="deletingPrompt?.title"
      @confirm="handleDelete"
      @cancel="cancelDelete"
    />
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
}

.not-connected {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.prompts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .prompts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
