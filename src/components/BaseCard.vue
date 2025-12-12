<template>
  <div :class="['base-card', { 'hoverable': hoverable, 'clickable': clickable }]" @click="handleClick">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.base-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-base);
}

.base-card.clickable {
  cursor: pointer;
  user-select: none;
}

.base-card.hoverable:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-border-strong);
}

.base-card.clickable:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
  border-color: var(--color-primary-200);
}

.base-card.clickable:active {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  background-color: var(--color-background-secondary);
}

.card-body {
  padding: var(--spacing-6);
  color: var(--color-text-primary);
}

.card-footer {
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--color-background-secondary);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}
</style>
