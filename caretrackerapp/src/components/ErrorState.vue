<template>
  <div class="error-container">
    <div class="error-card">
      <div class="error-icon">⚠️</div>
      <h2>{{ title }}</h2>
      <p class="error-message">{{ message }}</p>
      <BaseButton @click="handleRetry" variant="primary">{{ retryLabel }}</BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Oops! Something went wrong'
  },
  message: {
    type: String,
    required: true
  },
  retryLabel: {
    type: String,
    default: 'Retry'
  }
})

const emit = defineEmits(['retry'])

function handleRetry() {
  emit('retry')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem;
}

.error-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 500px;
  border: 2px solid #fee;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-card h2 {
  color: #c62828;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-message {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
</style>
