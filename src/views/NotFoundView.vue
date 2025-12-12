<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>

      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="error-actions">
        <BaseButton variant="primary" @click="goToDashboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Go to Dashboard
        </BaseButton>
        <BaseButton variant="secondary" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Go Back
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()

function goToDashboard() {
  router.push('/dashboard')
}

function goBack() {
  router.back()
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: var(--color-background-secondary);
  padding: var(--spacing-6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.error-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  padding: var(--spacing-10) var(--spacing-8);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-6);
  color: var(--color-danger-500);
  opacity: 0.8;
}

.error-code {
  font-size: 6rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-4);
  line-height: 1;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-3);
}

.error-message {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-8);
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-content {
    padding: var(--spacing-8) var(--spacing-6);
  }

  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: var(--font-size-xl);
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions button {
    width: 100%;
  }
}
</style>
