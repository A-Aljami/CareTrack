<template>
  <div id="app">
    <NavHeader v-if="authStore.isLoggedIn" />
    <main :class="{ 'main-content': true, 'has-header': authStore.isLoggedIn }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style>
#app {
  height: 100vh;
  width: 100%;
  display: flex;
  background-color: var(--color-background-secondary);
  overflow: hidden;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.main-content.has-header {
  margin-left: var(--sidebar-width);
}

@media (max-width: 768px) {
  .main-content.has-header {
    margin-left: 70px;
  }
}
</style>