<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo-icon" @click="toggleSidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <h1 class="logo">CareTrack</h1>
      </div>
    </div>

    <nav class="nav-links">
      <RouterLink to="/dashboard" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>Dashboard</span>
      </RouterLink>
      <RouterLink to="/patients" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>Patients</span>
      </RouterLink>
      <RouterLink to="/appointments/new" class="nav-link">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
          <line x1="12" y1="14" x2="12" y2="18"></line>
          <line x1="10" y1="16" x2="14" y2="16"></line>
        </svg>
        <span>New Appointment</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button @click="toggleDarkMode($event)" class="settings-btn">
        <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
      <button @click="handleLogout" class="settings-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDarkMode } from '@/composables/useDarkMode'

const router = useRouter()
const authStore = useAuthStore()
const { isDarkMode, toggleDarkMode } = useDarkMode()
const isCollapsed = ref(false)

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background-color: hsl(var(--sidebar));
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-6) 0;
  z-index: var(--z-fixed);
  box-shadow: var(--shadow-lg);
  border-right: 1px solid var(--color-border);
  transition: width var(--transition-base);
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar.collapsed .logo,
.sidebar.collapsed .nav-link span,
.sidebar.collapsed .settings-btn span {
  display: none;
}

.sidebar-header {
  padding: 0 var(--spacing-6) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  border-radius: var(--radius-base);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.logo-icon:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.logo {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: var(--letter-spacing-tight);
}

.nav-links {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-6) var(--spacing-4) 0;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  background-color: #1e3a8a;
  color: white;
}

.dark-mode .nav-link:hover {
  background-color: #293e60;
  color: white;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  background-color: #1e3a8a;
  color: white;
}

.dark-mode .nav-link.router-link-active,
.dark-mode .nav-link.router-link-exact-active {
  background-color: #293e60;
  color: white;
}

.nav-link svg {
  flex-shrink: 0;
}

.sidebar-footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--color-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.settings-btn:hover {
  background-color: #1e3a8a;
  color: white;
}

.dark-mode .settings-btn:hover {
  background-color: #293e60;
  color: white;
}

.settings-btn svg {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .logo span,
  .nav-link span,
  .settings-btn span {
    display: none;
  }
}
</style>
