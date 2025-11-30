import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue')
  },
  {
    path: '/share/:id',
    name: 'shared-prompt',
    component: () => import('@/views/SharedPromptView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
