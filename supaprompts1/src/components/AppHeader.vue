<script setup>
import { useSettingsStore } from '@/stores/settings'

const emit = defineEmits(['toggle-sidebar'])

const settingsStore = useSettingsStore()
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button
        class="btn btn-link header-menu-btn"
        @click="emit('toggle-sidebar')"
        title="Toggle Sidebar"
      >
        <i class="bi bi-list fs-4"></i>
      </button>
    </div>

    <div class="header-right">
      <!-- Dark Mode Toggle -->
      <button
        class="btn btn-link header-btn"
        @click="settingsStore.toggleDarkMode()"
        :title="settingsStore.darkMode ? 'Light Mode' : 'Dark Mode'"
      >
        <i class="bi" :class="settingsStore.darkMode ? 'bi-sun' : 'bi-moon'"></i>
      </button>

      <!-- Settings Link -->
      <router-link to="/settings" class="btn btn-link header-btn" title="Settings">
        <i class="bi bi-gear"></i>
      </router-link>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--bs-body-bg);
  border-bottom: 1px solid var(--bs-border-color);
  position: sticky;
  top: 0;
  z-index: 1020;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-menu-btn,
.header-btn {
  color: var(--bs-body-color);
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.15s ease;
}

.header-menu-btn:hover,
.header-btn:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-body-color);
}

</style>
