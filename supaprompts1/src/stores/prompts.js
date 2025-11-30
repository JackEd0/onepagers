import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSupabase } from '@/composables/useSupabase'
import { useCollectionsStore } from './collections'

export const usePromptsStore = defineStore('prompts', () => {
  // State
  const prompts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const selectedTags = ref([])
  const showFavoritesOnly = ref(false)
  const sortBy = ref('created_at') // created_at, last_copied_at, copied_count, title

  // Getters
  const allTags = computed(() => {
    const tagsSet = new Set()
    prompts.value.forEach(p => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach(tag => tagsSet.add(tag))
      }
    })
    return Array.from(tagsSet).sort()
  })

  const filteredPrompts = computed(() => {
    const collectionsStore = useCollectionsStore()
    let result = [...prompts.value]

    // Filter by active collection
    if (collectionsStore.activeCollectionId) {
      result = result.filter(p => p.collection_id === collectionsStore.activeCollectionId)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.title?.toLowerCase().includes(query) ||
        p.template?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by selected tags
    if (selectedTags.value.length > 0) {
      result = result.filter(p => 
        p.tags && selectedTags.value.every(tag => p.tags.includes(tag))
      )
    }

    // Filter by favorites
    if (showFavoritesOnly.value) {
      result = result.filter(p => p.is_favorite)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '')
        case 'copied_count':
          return (b.copied_count || 0) - (a.copied_count || 0)
        case 'last_copied_at':
          return new Date(b.last_copied_at || 0) - new Date(a.last_copied_at || 0)
        case 'created_at':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      }
    })

    return result
  })

  // Actions
  async function fetchPrompts() {
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
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      prompts.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching prompts:', err)
    } finally {
      loading.value = false
    }
  }

  async function createPrompt(promptData) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('prompts')
        .insert({
          title: promptData.title,
          template: promptData.template,
          description: promptData.description || null,
          collection_id: promptData.collection_id || null,
          tags: promptData.tags || [],
          is_favorite: promptData.is_favorite || false,
          example_input: promptData.example_input || null,
          example_output: promptData.example_output || null
        })
        .select()
        .single()

      if (createError) throw createError
      
      prompts.value.unshift(data)
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error creating prompt:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updatePrompt(id, updates) {
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
        .from('prompts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = data
      }
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error updating prompt:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deletePrompt(id) {
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
        .from('prompts')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      prompts.value = prompts.value.filter(p => p.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting prompt:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function toggleFavorite(id) {
    const prompt = prompts.value.find(p => p.id === id)
    if (!prompt) return false

    return await updatePrompt(id, { is_favorite: !prompt.is_favorite })
  }

  async function incrementCopyCount(id) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) return false

    try {
      const prompt = prompts.value.find(p => p.id === id)
      if (!prompt) return false

      const { data, error: updateError } = await supabase
        .from('prompts')
        .update({ 
          copied_count: (prompt.copied_count || 0) + 1,
          last_copied_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      const index = prompts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        prompts.value[index] = data
      }
      return true
    } catch (err) {
      console.error('Error incrementing copy count:', err)
      return false
    }
  }

  async function fetchPromptById(id) {
    const { getClient } = useSupabase()
    const supabase = getClient()
    
    if (!supabase) {
      error.value = 'Not connected to Supabase'
      return null
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching prompt:', err)
      return null
    }
  }

  // Parse variables from template
  function parseVariables(template) {
    const regex = /\{\{(\w+)\}\}/g
    const variables = []
    let match

    while ((match = regex.exec(template)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    return variables
  }

  // Replace variables in template
  function replaceVariables(template, values) {
    let result = template
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
    }
    return result
  }

  // Filter actions
  function setSearchQuery(query) {
    searchQuery.value = query
  }

  function setSelectedTags(tags) {
    selectedTags.value = tags
  }

  function toggleTag(tag) {
    const index = selectedTags.value.indexOf(tag)
    if (index === -1) {
      selectedTags.value.push(tag)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  function setShowFavoritesOnly(value) {
    showFavoritesOnly.value = value
  }

  function setSortBy(value) {
    sortBy.value = value
  }

  function clearFilters() {
    searchQuery.value = ''
    selectedTags.value = []
    showFavoritesOnly.value = false
    sortBy.value = 'created_at'
  }

  return {
    prompts,
    loading,
    error,
    searchQuery,
    selectedTags,
    showFavoritesOnly,
    sortBy,
    allTags,
    filteredPrompts,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    incrementCopyCount,
    fetchPromptById,
    parseVariables,
    replaceVariables,
    setSearchQuery,
    setSelectedTags,
    toggleTag,
    setShowFavoritesOnly,
    setSortBy,
    clearFilters
  }
})
