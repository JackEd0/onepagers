import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSupabase } from '@/composables/useSupabase'

export const useCollectionsStore = defineStore('collections', () => {
  // State
  const collections = ref([])
  const loading = ref(false)
  const error = ref(null)
  const activeCollectionId = ref(null)

  // Getters
  const sortedCollections = computed(() => {
    return [...collections.value].sort((a, b) => a.sort_order - b.sort_order)
  })

  const activeCollection = computed(() => {
    return collections.value.find(c => c.id === activeCollectionId.value) || null
  })

  // Actions
  async function fetchCollections() {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true })

      if (fetchError) throw fetchError
      collections.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching collections:', err)
    } finally {
      loading.value = false
    }
  }

  async function createCollection(name) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return null
    }

    loading.value = true
    error.value = null

    try {
      // Get the max sort_order to add new collection at the end
      const maxSortOrder = collections.value.reduce((max, c) => Math.max(max, c.sort_order || 0), 0)

      const { data, error: createError } = await supabase
        .from('collections')
        .insert({ name, sort_order: maxSortOrder + 1 })
        .select()
        .single()

      if (createError) throw createError
      
      collections.value.push(data)
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error creating collection:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCollection(id, updates) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      const index = collections.value.findIndex(c => c.id === id)
      if (index !== -1) {
        collections.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error updating collection:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCollection(id) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return false
    }

    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      collections.value = collections.value.filter(c => c.id !== id)
      
      if (activeCollectionId.value === id) {
        activeCollectionId.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting collection:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function reorderCollections(reorderedIds) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return false
    }

    try {
      // Update sort_order for each collection
      const updates = reorderedIds.map((id, index) => ({
        id,
        sort_order: index
      }))

      for (const update of updates) {
        await supabase
          .from('collections')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      }

      // Update local state
      collections.value = collections.value.map(c => {
        const newOrder = reorderedIds.indexOf(c.id)
        return { ...c, sort_order: newOrder }
      })

      return true
    } catch (err) {
      error.value = err.message
      console.error('Error reordering collections:', err)
      return false
    }
  }

  function setActiveCollection(id) {
    activeCollectionId.value = id
  }

  function clearActiveCollection() {
    activeCollectionId.value = null
  }

  return {
    collections,
    loading,
    error,
    activeCollectionId,
    sortedCollections,
    activeCollection,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    reorderCollections,
    setActiveCollection,
    clearActiveCollection
  }
})
