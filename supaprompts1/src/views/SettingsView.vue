<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useSupabase } from '@/composables/useSupabase'

const settingsStore = useSettingsStore()
const { testConnection } = useSupabase()

const url = ref(settingsStore.supabaseUrl)
const anonKey = ref(settingsStore.supabaseAnonKey)
const testing = ref(false)
const saved = ref(false)

async function handleSave() {
  testing.value = true
  saved.value = false

  // Save credentials
  settingsStore.saveCredentials(url.value, anonKey.value)

  // Test connection
  const connected = await testConnection()
  
  testing.value = false
  
  if (connected) {
    saved.value = true
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: 'Connected successfully!', type: 'success' }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: settingsStore.connectionError || 'Failed to connect', type: 'error' }
    }))
  }
}

function handleClear() {
  url.value = ''
  anonKey.value = ''
  settingsStore.clearCredentials()
  saved.value = false
  window.dispatchEvent(new CustomEvent('show-toast', { 
    detail: { message: 'Credentials cleared', type: 'info' }
  }))
}

onMounted(() => {
  url.value = settingsStore.supabaseUrl
  anonKey.value = settingsStore.supabaseAnonKey
})
</script>

<template>
  <div class="settings-view">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 col-xl-6">
          <h1 class="display-6 fw-bold mb-4">
            <i class="bi bi-gear me-3"></i>Settings
          </h1>

          <!-- Supabase Configuration -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0">
              <h5 class="card-title mb-1">
                <i class="bi bi-database me-2"></i>Supabase Connection
              </h5>
              <p class="text-muted small mb-0">
                Connect to your own Supabase instance to store your prompts securely.
              </p>
            </div>
            <div class="card-body">
              <!-- Connection Status -->
              <div class="alert mb-4" :class="settingsStore.isConnected ? 'alert-success' : 'alert-warning'">
                <div class="d-flex align-items-center">
                  <i class="bi me-2" :class="settingsStore.isConnected ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'"></i>
                  <span>
                    {{ settingsStore.isConnected ? 'Connected to Supabase' : 'Not connected' }}
                  </span>
                </div>
                <small v-if="settingsStore.connectionError" class="d-block mt-1 text-danger">
                  {{ settingsStore.connectionError }}
                </small>
              </div>

              <form @submit.prevent="handleSave">
                <div class="mb-3">
                  <label class="form-label fw-medium">Supabase URL</label>
                  <input 
                    v-model="url"
                    type="url" 
                    class="form-control form-control-lg"
                    placeholder="https://your-project.supabase.co"
                    required
                  >
                  <div class="form-text">
                    Find this in your Supabase project settings under API.
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label fw-medium">Anon Key</label>
                  <input 
                    v-model="anonKey"
                    type="password" 
                    class="form-control form-control-lg"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    required
                  >
                  <div class="form-text">
                    Use the public anon key (safe to use in browser).
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="testing"
                  >
                    <span v-if="testing" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-lg me-2"></i>
                    {{ testing ? 'Testing...' : 'Save & Connect' }}
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-danger btn-lg"
                    @click="handleClear"
                    :disabled="testing"
                  >
                    <i class="bi bi-trash me-2"></i>
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Appearance -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0">
              <h5 class="card-title mb-1">
                <i class="bi bi-palette me-2"></i>Appearance
              </h5>
            </div>
            <div class="card-body">
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="darkModeToggle"
                  :checked="settingsStore.darkMode"
                  @change="settingsStore.toggleDarkMode()"
                >
                <label class="form-check-label" for="darkModeToggle">
                  <i class="bi bi-moon-stars me-2"></i>
                  Dark Mode
                </label>
              </div>
            </div>
          </div>

          <!-- Database Setup -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-bottom-0 pt-4 pb-0">
              <h5 class="card-title mb-1">
                <i class="bi bi-code-square me-2"></i>Database Setup
              </h5>
              <p class="text-muted small mb-0">
                Run this SQL in your Supabase SQL Editor to create the required tables.
              </p>
            </div>
            <div class="card-body">
              <pre class="bg-dark text-light p-3 rounded-3 small overflow-auto"><code>-- Collections
create table collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Prompts
create table prompts (
  id uuid primary key default uuid_generate_v4(),
  collection_id uuid references collections(id) on delete set null,
  title text not null,
  template text not null,
  description text,
  example_input jsonb,
  example_output text,
  tags text[] default '{}',
  is_favorite boolean default false,
  copied_count int default 0,
  last_copied_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);</code></pre>
              <button 
                class="btn btn-outline-secondary btn-sm mt-2"
                @click="navigator.clipboard.writeText($refs.sqlCode?.textContent || '')"
              >
                <i class="bi bi-clipboard me-2"></i>
                Copy SQL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 1rem 0;
}

pre {
  max-height: 300px;
  margin-bottom: 0;
}

.form-control-lg {
  border-radius: 0.75rem;
}

.btn-lg {
  border-radius: 0.75rem;
}

.card {
  border-radius: 1rem;
}
</style>
