<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCollectionsStore } from '@/stores/collections'
import DeleteConfirmModal from './DeleteConfirmModal.vue'

const emit = defineEmits(['edit'])

const router = useRouter()
const collectionsStore = useCollectionsStore()

const showDeleteModal = ref(false)
const deletingCollection = ref(null)
const draggedIndex = ref(null)

function selectCollection(collection) {
  collectionsStore.setActiveCollection(collection.id)
  router.push('/')
}

function confirmDelete(collection, event) {
  event.stopPropagation()
  deletingCollection.value = collection
  showDeleteModal.value = true
}

async function handleDelete() {
  if (deletingCollection.value) {
    await collectionsStore.deleteCollection(deletingCollection.value.id)
  }
  showDeleteModal.value = false
  deletingCollection.value = null
}

function cancelDelete() {
  showDeleteModal.value = false
  deletingCollection.value = null
}

// Drag and drop handlers
function handleDragStart(event, index) {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(event, index) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function handleDrop(event, targetIndex) {
  event.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    return
  }

  const collections = [...collectionsStore.sortedCollections]
  const [removed] = collections.splice(draggedIndex.value, 1)
  collections.splice(targetIndex, 0, removed)
  
  const reorderedIds = collections.map(c => c.id)
  collectionsStore.reorderCollections(reorderedIds)
  
  draggedIndex.value = null
}

function handleDragEnd() {
  draggedIndex.value = null
}
</script>

<template>
  <ul class="collection-list nav flex-column">
    <li 
      v-for="(collection, index) in collectionsStore.sortedCollections" 
      :key="collection.id"
      class="nav-item"
      draggable="true"
      @dragstart="handleDragStart($event, index)"
      @dragover="handleDragOver($event, index)"
      @drop="handleDrop($event, index)"
      @dragend="handleDragEnd"
    >
      <a 
        href="#"
        class="nav-link collection-item"
        :class="{ active: collectionsStore.activeCollectionId === collection.id }"
        @click.prevent="selectCollection(collection)"
      >
        <i class="bi bi-folder me-2"></i>
        <span class="collection-name">{{ collection.name }}</span>
        <div class="collection-actions">
          <button 
            class="btn btn-link btn-sm p-0"
            @click.stop="emit('edit', collection)"
            title="Edit"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button 
            class="btn btn-link btn-sm p-0 text-danger"
            @click="confirmDelete(collection, $event)"
            title="Delete"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </a>
    </li>

    <li v-if="collectionsStore.sortedCollections.length === 0" class="nav-item">
      <span class="nav-link text-muted small">
        <i class="bi bi-folder-plus me-2"></i>
        No collections yet
      </span>
    </li>
  </ul>

  <DeleteConfirmModal
    :show="showDeleteModal"
    :item-name="deletingCollection?.name"
    item-type="collection"
    @confirm="handleDelete"
    @cancel="cancelDelete"
  />
</template>

<style scoped>
.collection-list {
  padding: 0;
}

.collection-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  color: var(--bs-body-color);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.collection-item:hover {
  background-color: var(--bs-tertiary-bg);
}

.collection-item.active {
  background-color: var(--bs-primary-bg-subtle);
  color: var(--bs-primary);
}

.collection-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.collection-actions {
  display: none;
  gap: 0.25rem;
}

.collection-item:hover .collection-actions {
  display: flex;
}

.collection-actions .btn {
  font-size: 0.75rem;
  opacity: 0.6;
}

.collection-actions .btn:hover {
  opacity: 1;
}

[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}
</style>
