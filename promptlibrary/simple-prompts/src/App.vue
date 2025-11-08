<script setup>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import PromptGrid from './components/PromptGrid.vue'

const searchQuery = ref('')
const selectedTags = ref([])
const showFavoritesOnly = ref(false)

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleTagFilter = (tags) => {
  selectedTags.value = tags
}

const handleFavoriteFilter = (showFavorites) => {
  showFavoritesOnly.value = showFavorites
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="3" lg="2">
            <Sidebar
              @search="handleSearch"
              @tag-filter="handleTagFilter"
              @favorite-filter="handleFavoriteFilter"
            />
          </v-col>
          <v-col cols="12" md="9" lg="10">
            <PromptGrid
              :search-query="searchQuery"
              :selected-tags="selectedTags"
              :show-favorites-only="showFavoritesOnly"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-app {
  background-color: #f5f5f5;
}
</style>
