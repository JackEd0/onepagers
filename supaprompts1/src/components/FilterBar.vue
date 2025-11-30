<script setup>
import { computed } from 'vue'
import { usePromptsStore } from '@/stores/prompts'

const promptsStore = usePromptsStore()

const hasActiveFilters = computed(() => {
  return promptsStore.selectedTags.length > 0 ||
         promptsStore.showFavoritesOnly ||
         promptsStore.sortBy !== 'created_at'
})
</script>

<template>
  <div class="filter-bar">
    <div class="filter-group">
      <!-- Tags Filter -->
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          :class="{ 'btn-primary': promptsStore.selectedTags.length > 0 }"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-tags me-2"></i>
          Tags
          <span v-if="promptsStore.selectedTags.length" class="badge bg-white text-primary ms-2">
            {{ promptsStore.selectedTags.length }}
          </span>
        </button>
        <ul class="dropdown-menu">
          <li v-if="promptsStore.allTags.length === 0">
            <span class="dropdown-item-text text-muted">No tags yet</span>
          </li>
          <li v-for="tag in promptsStore.allTags" :key="tag">
            <button
              class="dropdown-item d-flex align-items-center"
              @click.stop="promptsStore.toggleTag(tag)"
            >
              <i
                class="bi me-2"
                :class="promptsStore.selectedTags.includes(tag) ? 'bi-check-square-fill text-primary' : 'bi-square'"
              ></i>
              {{ tag }}
            </button>
          </li>
          <li v-if="promptsStore.selectedTags.length > 0">
            <hr class="dropdown-divider">
          </li>
          <li v-if="promptsStore.selectedTags.length > 0">
            <button
              class="dropdown-item text-danger"
              @click="promptsStore.setSelectedTags([])"
            >
              <i class="bi bi-x-lg me-2"></i>
              Clear Tags
            </button>
          </li>
        </ul>
      </div>

      <!-- Favorites Filter -->
      <button
        class="btn"
        :class="promptsStore.showFavoritesOnly ? 'btn-warning' : 'btn-outline-secondary'"
        @click="promptsStore.setShowFavoritesOnly(!promptsStore.showFavoritesOnly)"
      >
        <i class="bi" :class="promptsStore.showFavoritesOnly ? 'bi-star-fill' : 'bi-star'"></i>
        <span class="d-none d-sm-inline ms-2">Favorites</span>
      </button>

      <!-- Sort Dropdown -->
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-sort-down me-2"></i>
          <span class="d-none d-sm-inline">Sort</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button
              class="dropdown-item"
              :class="{ active: promptsStore.sortBy === 'created_at' }"
              @click="promptsStore.setSortBy('created_at')"
            >
              <i class="bi bi-calendar me-2"></i>
              Last Created
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              :class="{ active: promptsStore.sortBy === 'last_copied_at' }"
              @click="promptsStore.setSortBy('last_copied_at')"
            >
              <i class="bi bi-clock me-2"></i>
              Last Copied
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              :class="{ active: promptsStore.sortBy === 'copied_count' }"
              @click="promptsStore.setSortBy('copied_count')"
            >
              <i class="bi bi-graph-up me-2"></i>
              Most Copied
            </button>
          </li>
          <li>
            <button
              class="dropdown-item"
              :class="{ active: promptsStore.sortBy === 'title' }"
              @click="promptsStore.setSortBy('title')"
            >
              <i class="bi bi-sort-alpha-down me-2"></i>
              Title A-Z
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Clear All Filters -->
    <button
      v-if="hasActiveFilters"
      class="btn btn-link text-danger"
      @click="promptsStore.clearFilters"
    >
      <i class="bi bi-x-lg me-1"></i>
      Clear Filters
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  border-radius: 0.75rem;
}

.dropdown-menu {
  border-radius: 0.75rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: 1px solid var(--bs-border-color);
}

.dropdown-item {
  border-radius: 0.5rem;
  margin: 0.25rem;
  width: calc(100% - 0.5rem);
}

.dropdown-item.active {
  background-color: var(--bs-primary);
}
</style>
