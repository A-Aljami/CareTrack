<template>
  <button
    :class="['base-button', variant, { 'full-width': fullWidth }]"
    :type="type"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
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
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button.full-width {
  width: 100%;
}

.base-button.primary {
  background-color: #4CAF50;
  color: white;
}

.base-button.primary:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.base-button.secondary {
  background-color: #2c3e50;
  color: white;
}

.base-button.secondary:hover:not(:disabled) {
  background-color: #1a252f;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(44, 62, 80, 0.3);
}

.base-button.danger {
  background-color: #f44336;
  color: white;
}

.base-button.danger:hover:not(:disabled) {
  background-color: #da190b;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.base-button.success {
  background-color: #4CAF50;
  color: white;
}

.base-button.success:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}
</style>
