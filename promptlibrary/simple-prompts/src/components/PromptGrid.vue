<script setup>
import { ref, computed, onMounted } from 'vue'
import PromptCard from './PromptCard.vue'
import { fetchPrompts } from '../services/notionService.js'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedTags: {
    type: Array,
    default: () => []
  },
  showFavoritesOnly: {
    type: Boolean,
    default: false
  }
})

const prompts = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // Try to fetch from Notion API first
    if (import.meta.env.VITE_NOTION_API_KEY && import.meta.env.VITE_NOTION_DATABASE_ID) {
      prompts.value = await fetchPrompts()
    } else {
      // Fallback to mock data if Notion credentials are not configured
      console.warn('Notion API credentials not found. Using mock data.')
      prompts.value = getMockPrompts()
    }
  } catch (err) {
    console.error('Error loading prompts:', err)
    error.value = 'Failed to load prompts. Using mock data as fallback.'
    prompts.value = getMockPrompts()
  } finally {
    loading.value = false
  }
})

const getMockPrompts = () => [
  {
    id: 1,
    title: 'Creative Writing Prompt',
    instructions: 'Write a short story about a mysterious artifact.',
    content: 'Once upon a time, in a small village nestled between ancient mountains, there was a mysterious artifact that glowed with an otherworldly light...',
    tags: ['Writing', 'Creative'],
    favorite: true
  },
  {
    id: 2,
    title: 'Code Review Checklist',
    instructions: 'Review the following code for best practices.',
    content: '1. Check for proper error handling\n2. Ensure code is readable and well-commented\n3. Verify performance optimizations\n4. Test edge cases',
    tags: ['Code', 'Review'],
    favorite: false
  },
  {
    id: 3,
    title: 'Marketing Strategy',
    instructions: 'Develop a marketing plan for a new product launch.',
    content: 'Target audience analysis, competitor research, channel selection, budget allocation, timeline planning...',
    tags: ['Marketing', 'Business'],
    favorite: true
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    instructions: 'Apply these principles to improve user experience.',
    content: 'Consistency, hierarchy, feedback, accessibility, simplicity, user-centered design...',
    tags: ['Design', 'UI/UX'],
    favorite: false
  },
  {
    id: 5,
    title: 'AI Prompt Engineering',
    instructions: 'Craft effective prompts for AI language models.',
    content: 'Be specific, provide context, use examples, iterate and refine, test different approaches...',
    tags: ['AI', 'Writing'],
    favorite: true
  },
  {
    id: 6,
    title: 'Project Management',
    instructions: 'Plan and execute a software development project.',
    content: 'Define scope, create timeline, assign tasks, track progress, manage risks, communicate with stakeholders...',
    tags: ['Business', 'Management'],
    favorite: false
  }
]

const filteredPrompts = computed(() => {
  let filtered = prompts.value

  // Filter by search query
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.instructions.toLowerCase().includes(query) ||
      prompt.content.toLowerCase().includes(query) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filter by tags
  if (props.selectedTags.length > 0) {
    filtered = filtered.filter(prompt =>
      props.selectedTags.some(tag => prompt.tags.includes(tag))
    )
  }

  // Filter by favorites
  if (props.showFavoritesOnly) {
    filtered = filtered.filter(prompt => prompt.favorite)
  }

  return filtered
})
</script>

<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 mb-6">Prompts</h2>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error" class="mb-4">
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>

    <!-- Prompts Grid -->
    <v-row v-else>
      <v-col
        v-for="prompt in filteredPrompts"
        :key="prompt.id"
        cols="12"
        sm="6"
        lg="4"
        xl="3"
      >
        <PromptCard :prompt="prompt" />
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-row v-if="!loading && !error && filteredPrompts.length === 0">
      <v-col cols="12">
        <v-alert type="info" class="text-center">
          No prompts found matching your criteria.
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text-h4 {
  color: #333;
  font-weight: 600;
}
</style>