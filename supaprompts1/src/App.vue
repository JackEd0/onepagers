<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useCollectionsStore } from '@/stores/collections'
import { usePromptsStore } from '@/stores/prompts'
import { useSupabase } from '@/composables/useSupabase'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const settingsStore = useSettingsStore()
const collectionsStore = useCollectionsStore()
const promptsStore = usePromptsStore()
const { testConnection } = useSupabase()

const sidebarOpen = ref(true)

// Initialize app
onMounted(async () => {
  // Apply dark mode setting
  settingsStore.applyDarkMode()

  // Test connection and load data if credentials exist
  if (settingsStore.hasCredentials) {
    const connected = await testConnection()
    if (connected) {
      await Promise.all([
        collectionsStore.fetchCollections(),
        promptsStore.fetchPrompts()
      ])
    }
  }
})

// Watch for connection changes
watch(() => settingsStore.isConnected, async (connected) => {
  if (connected) {
    await Promise.all([
      collectionsStore.fetchCollections(),
      promptsStore.fetchPrompts()
    ])
  }
})

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <AppSidebar :open="sidebarOpen" @toggle="toggleSidebar" />

    <main class="main-content">
      <AppHeader @toggle-sidebar="toggleSidebar" />
      <div class="content-wrapper">
        <RouterView />
      </div>
    </main>

    <ToastContainer />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bs-body-bg);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

.content-wrapper {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
  }
}
</style>
