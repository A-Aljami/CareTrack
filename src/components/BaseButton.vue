<template>
  <button
    :class="[
      'base-button',
      `variant-${variant}`,
      `size-${size}`,
      { 'full-width': fullWidth, 'loading': loading }
    ]"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
  position: relative;
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.base-button:active:not(:disabled) {
  transform: scale(0.98);
}

/* Sizes */
.base-button.size-sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  gap: var(--spacing-1);
}

.base-button.size-md {
  padding: var(--spacing-3) var(--spacing-5);
  font-size: var(--font-size-sm);
}

.base-button.size-lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-base);
}

/* Primary Variant */
.base-button.variant-primary {
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: white;
  box-shadow: var(--shadow-sm);
}

.base-button.variant-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Secondary Variant */
.base-button.variant-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.base-button.variant-secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
  border-color: var(--color-border-strong);
}

/* Outline Variant */
.base-button.variant-outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-300);
}

.base-button.variant-outline:hover:not(:disabled) {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-400);
}

/* Ghost Variant */
.base-button.variant-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  border-color: transparent;
}

.base-button.variant-ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
}

/* Success Variant */
.base-button.variant-success {
  background: linear-gradient(135deg, var(--color-success-500), var(--color-success-600));
  color: white;
  box-shadow: var(--shadow-sm);
}

.base-button.variant-success:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-success-600), var(--color-success-700));
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Danger Variant */
.base-button.variant-danger {
  background: linear-gradient(135deg, var(--color-danger-500), var(--color-danger-600));
  color: white;
  box-shadow: var(--shadow-sm);
}

.base-button.variant-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-danger-600), var(--color-danger-700));
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Warning Variant */
.base-button.variant-warning {
  background: linear-gradient(135deg, var(--color-warning-500), var(--color-warning-600));
  color: white;
  box-shadow: var(--shadow-sm);
}

.base-button.variant-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-warning-600), var(--color-warning-700));
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

/* Disabled State */
.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

/* Full Width */
.base-button.full-width {
  width: 100%;
}

/* Loading State */
.base-button.loading {
  cursor: wait;
  opacity: 0.8;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
