<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useCollectionsStore } from '@/stores/collections'
import CollectionList from './CollectionList.vue'
import CollectionModal from './CollectionModal.vue'
import { ref } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const collectionsStore = useCollectionsStore()

const showCollectionModal = ref(false)
const editingCollection = ref(null)

function openNewCollectionModal() {
  editingCollection.value = null
  showCollectionModal.value = true
}

function openEditCollectionModal(collection) {
  editingCollection.value = collection
  showCollectionModal.value = true
}

function closeCollectionModal() {
  showCollectionModal.value = false
  editingCollection.value = null
}

async function handleSaveCollection(data) {
  if (editingCollection.value) {
    await collectionsStore.updateCollection(editingCollection.value.id, data)
  } else {
    await collectionsStore.createCollection(data.name)
  }
  closeCollectionModal()
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar-open': open }">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-brand">
        <i class="bi bi-lightning-charge-fill text-primary me-2"></i>
        <span class="brand-text">SupaPrompts</span>
      </router-link>
      <button class="btn btn-link sidebar-toggle d-lg-none" @click="emit('toggle')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: route.path === '/' && !collectionsStore.activeCollectionId }"
            @click="collectionsStore.clearActiveCollection()"
          >
            <i class="bi bi-house me-2"></i>
            All Prompts
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/settings" class="nav-link" :class="{ active: route.path === '/settings' }">
            <i class="bi bi-gear me-2"></i>
            Settings
          </router-link>
        </li>
      </ul>

      <!-- Collections Section -->
      <div class="collections-section" v-if="settingsStore.isConnected">
        <div class="section-header">
          <span class="section-title">Collections</span>
          <button
            class="btn btn-link btn-sm p-0 text-muted"
            @click="openNewCollectionModal"
            title="Add Collection"
          >
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>

        <CollectionList
          @edit="openEditCollectionModal"
        />
      </div>
    </nav>

    <!-- Connection Status -->
    <div class="sidebar-footer">
      <div class="connection-status" :class="settingsStore.isConnected ? 'connected' : 'disconnected'">
        <i class="bi" :class="settingsStore.isConnected ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'"></i>
        <span>{{ settingsStore.isConnected ? 'Connected' : 'Not Connected' }}</span>
      </div>
    </div>

    <!-- Collection Modal -->
    <CollectionModal
      :show="showCollectionModal"
      :collection="editingCollection"
      @close="closeCollectionModal"
      @save="handleSaveCollection"
    />
  </aside>

  <!-- Overlay for mobile -->
  <div
    v-if="open"
    class="sidebar-overlay d-lg-none"
    @click="emit('toggle')"
  ></div>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--bs-body-bg);
  border-right: 1px solid var(--bs-border-color);
  display: flex;
  flex-direction: column;
  z-index: 1040;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bs-body-color);
  text-decoration: none;
}

.sidebar-toggle {
  color: var(--bs-body-color);
  padding: 0.25rem;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  color: var(--bs-body-color);
  transition: background-color 0.15s ease;
  border-radius: 0;
}

.nav-link:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-body-color);
}

.nav-link.active {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
  font-weight: 500;
}

.collections-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--bs-border-color);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1.25rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--bs-secondary-color);
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--bs-border-color);
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.connection-status.connected {
  color: var(--bs-success);
}

.connection-status.disconnected {
  color: var(--bs-warning);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1035;
}

@media (max-width: 991.98px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }
}

@media (min-width: 992px) {
  .sidebar + .main-content {
    margin-left: 280px;
  }
}
</style>
