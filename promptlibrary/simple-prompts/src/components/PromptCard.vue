<script setup>
import { ref } from 'vue'

const props = defineProps({
  prompt: {
    type: Object,
    required: true
  }
})

const showFullContent = ref(false)

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log('Copied to clipboard')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const copyContent = () => {
  copyToClipboard(props.prompt.content)
}

const copyWholePrompt = () => {
  const fullPrompt = `${props.prompt.title}\n\n${props.prompt.instructions}\n\n${props.prompt.content}`
  copyToClipboard(fullPrompt)
}

const toggleFavorite = () => {
  // This would typically update the backend
  props.prompt.favorite = !props.prompt.favorite
}
</script>

<template>
  <v-card
    class="prompt-card"
    elevation="2"
    hover
  >
    <v-card-title class="pb-2">
      <div class="d-flex align-center justify-space-between w-100">
        <h3 class="text-h6 font-weight-medium">{{ prompt.title }}</h3>
        <v-btn
          icon
          size="small"
          variant="text"
          @click="toggleFavorite"
          :color="prompt.favorite ? 'red' : 'grey'"
        >
          <v-icon>mdi-heart{{ prompt.favorite ? '' : '-outline' }}</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text class="pt-0">
      <p class="text-body-2 mb-3 text-medium-emphasis">
        {{ prompt.instructions }}
      </p>

      <div class="content-section mb-4">
        <p
          class="text-body-1"
          :class="{ 'text-truncate': !showFullContent }"
        >
          {{ prompt.content }}
        </p>
        <v-btn
          v-if="prompt.content.length > 100"
          variant="text"
          size="small"
          @click="showFullContent = !showFullContent"
          class="pa-0"
        >
          {{ showFullContent ? 'Show less' : 'Show more' }}
        </v-btn>
      </div>

      <div class="tags-section mb-4">
        <v-chip
          v-for="tag in prompt.tags"
          :key="tag"
          size="small"
          variant="outlined"
          class="mr-1 mb-1"
        >
          {{ tag }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-spacer />
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-content-copy"
        @click="copyContent"
      >
        Copy Content
      </v-btn>
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-clipboard-text"
        @click="copyWholePrompt"
      >
        Copy All
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.prompt-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.prompt-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.w-100 {
  width: 100%;
}

.content-section {
  min-height: 60px;
}

.tags-section .v-chip {
  font-size: 0.75rem;
}
</style>