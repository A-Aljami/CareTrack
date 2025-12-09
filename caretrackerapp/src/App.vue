<template>
  <div id="app">
    <NavHeader v-if="authStore.isLoggedIn" />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import NavHeader from '@/components/NavHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
}

#app:has(.nav-header) {
  padding-top: 0;
}
</style>