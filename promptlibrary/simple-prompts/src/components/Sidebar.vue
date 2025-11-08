<script setup>
import { ref, computed, onMounted } from 'vue'
import { getAllTags } from '../services/notionService.js'

const emit = defineEmits(['search', 'tag-filter', 'favorite-filter'])

const searchQuery = ref('')
const selectedTags = ref([])
const showFavoritesOnly = ref(false)
const allTags = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // For now, we'll use mock data since we don't have real Notion data yet
    // In a real implementation, you'd fetch prompts first and then extract tags
    const mockTags = [
      { name: 'AI', count: 15 },
      { name: 'Writing', count: 12 },
      { name: 'Code', count: 10 },
      { name: 'Design', count: 8 },
      { name: 'Marketing', count: 6 },
      { name: 'Business', count: 5 },
    ]
    allTags.value = mockTags.sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error loading tags:', error)
  } finally {
    loading.value = false
  }
})

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const handleTagToggle = (tagName) => {
  const index = selectedTags.value.indexOf(tagName)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tagName)
  }
  emit('tag-filter', selectedTags.value)
}

const handleFavoriteToggle = () => {
  showFavoritesOnly.value = !showFavoritesOnly.value
  emit('favorite-filter', showFavoritesOnly.value)
}
</script>

<template>
  <v-navigation-drawer
    permanent
    :width="280"
    class="sidebar"
  >
    <v-container class="pa-4">
      <!-- Website Name -->
      <v-row class="mb-6">
        <v-col>
          <h1 class="text-h5 font-weight-bold primary--text">Simple Prompts</h1>
        </v-col>
      </v-row>

      <!-- Search Bar -->
      <v-row class="mb-6">
        <v-col>
          <v-text-field
            v-model="searchQuery"
            label="Search prompts..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="comfortable"
            @input="handleSearch"
            clearable
          />
        </v-col>
      </v-row>

      <!-- Favorite Filter -->
      <v-row class="mb-4">
        <v-col>
          <v-btn
            :variant="showFavoritesOnly ? 'flat' : 'outlined'"
            color="primary"
            block
            @click="handleFavoriteToggle"
            prepend-icon="mdi-heart"
          >
            {{ showFavoritesOnly ? 'Show All' : 'Favorites Only' }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Tags Filter -->
      <v-row>
        <v-col>
          <h3 class="text-h6 mb-3">Filter by Tags</h3>
          <v-chip-group
            v-model:selected="selectedTags"
            column
            multiple
          >
            <v-chip
              v-for="tag in allTags"
              :key="tag.name"
              :value="tag.name"
              variant="outlined"
              @click="handleTagToggle(tag.name)"
              class="mb-2"
            >
              {{ tag.name }} ({{ tag.count }})
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>
    </v-container>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar {
  background-color: white;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  position: sticky;
  top: 0;
}

.primary--text {
  color: #bd93f9 !important;
}
</style>