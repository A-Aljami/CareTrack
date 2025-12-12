<template>
  <div class="error-container">
    <div class="error-card">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
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
  padding: var(--spacing-6);
}

.error-card {
  background: var(--color-surface);
  padding: var(--spacing-10) var(--spacing-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 1px solid var(--color-border);
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-6);
  color: var(--color-danger-500);
}

.error-card h2 {
  color: var(--color-danger-500);
  margin-bottom: var(--spacing-4);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.error-message {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-8);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

@media (max-width: 768px) {
  .error-card {
    padding: var(--spacing-8) var(--spacing-6);
  }

  .error-card h2 {
    font-size: var(--font-size-xl);
  }
}
</style>
