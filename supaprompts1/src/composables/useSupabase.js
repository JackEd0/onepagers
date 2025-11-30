import { ref, computed, watch } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { useSettingsStore } from '@/stores/settings'

let supabaseInstance = null

export function useSupabase() {
  const settingsStore = useSettingsStore()
  const client = ref(null)
  const isReady = computed(() => client.value !== null && settingsStore.isConnected)

  // Initialize or reinitialize client when credentials change
  function initClient() {
    if (settingsStore.hasCredentials) {
      try {
        supabaseInstance = createClient(
          settingsStore.supabaseUrl,
          settingsStore.supabaseAnonKey
        )
        client.value = supabaseInstance
        return supabaseInstance
      } catch (error) {
        console.error('Failed to create Supabase client:', error)
        settingsStore.setConnectionStatus(false, error.message)
        return null
      }
    }
    return null
  }

  // Test connection by making a simple query
  async function testConnection() {
    if (!settingsStore.hasCredentials) {
      settingsStore.setConnectionStatus(false, 'No credentials provided')
      return false
    }

    const supabase = initClient()
    if (!supabase) {
      return false
    }

    try {
      // Try to fetch from collections table to test connection
      const { error } = await supabase.from('collections').select('id').limit(1)

      if (error) {
        settingsStore.setConnectionStatus(false, error.message)
        return false
      }

      settingsStore.setConnectionStatus(true)
      return true
    } catch (error) {
      settingsStore.setConnectionStatus(false, error.message)
      return false
    }
  }

  // Get the current client instance
  function getClient() {
    if (!supabaseInstance && settingsStore.hasCredentials) {
      initClient()
    }
    return supabaseInstance
  }

  return {
    client,
    isReady,
    initClient,
    testConnection,
    getClient
  }
}
