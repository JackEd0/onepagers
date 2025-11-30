import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const supabaseUrl = ref(localStorage.getItem('supabaseUrl') || '')
  const supabaseAnonKey = ref(localStorage.getItem('supabaseAnonKey') || '')
  const darkMode = ref(localStorage.getItem('darkMode') === 'true')
  const isConnected = ref(false)
  const connectionError = ref(null)

  // Getters
  const hasCredentials = computed(() => {
    return supabaseUrl.value.trim() !== '' && supabaseAnonKey.value.trim() !== ''
  })

  // Actions
  function saveCredentials(url, key) {
    supabaseUrl.value = url
    supabaseAnonKey.value = key
    localStorage.setItem('supabaseUrl', url)
    localStorage.setItem('supabaseAnonKey', key)
  }

  function clearCredentials() {
    supabaseUrl.value = ''
    supabaseAnonKey.value = ''
    localStorage.removeItem('supabaseUrl')
    localStorage.removeItem('supabaseAnonKey')
    isConnected.value = false
    connectionError.value = null
  }

  function setConnectionStatus(connected, error = null) {
    isConnected.value = connected
    connectionError.value = error
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('darkMode', darkMode.value)
    applyDarkMode()
  }

  function applyDarkMode() {
    if (darkMode.value) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-bs-theme')
    }
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
    darkMode,
    isConnected,
    connectionError,
    hasCredentials,
    saveCredentials,
    clearCredentials,
    setConnectionStatus,
    toggleDarkMode,
    applyDarkMode
  }
})
