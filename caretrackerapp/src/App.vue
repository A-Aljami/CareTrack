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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  font-family: Arial, sans-serif;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  overflow: hidden;
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.main-content.has-header {
  padding-top: 70px;
}
</style>