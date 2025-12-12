<template>
  <span :class="['status-badge', status]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUSES } from '@/constants/appointmentStatus'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => APPOINTMENT_STATUSES.includes(value) || ['pending', 'active', 'inactive'].includes(value)
  }
})

const label = computed(() => {
  return APPOINTMENT_STATUS_LABELS[props.status] || props.status
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: capitalize;
  letter-spacing: 0.025em;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.status-badge.scheduled {
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-200);
}

/* Better visibility in dark mode */
.dark-mode .status-badge.scheduled {
  background-color: var(--color-primary-900);
  color: var(--color-primary-300);
  border: 1px solid var(--color-primary-600);
}

.status-badge.checked-in {
  background-color: var(--color-warning-100);
  color: var(--color-warning-700);
  border: 1px solid var(--color-warning-200);
}

.status-badge.completed {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
  border: 1px solid var(--color-success-200);
}

.status-badge.pending {
  background-color: var(--color-danger-100);
  color: var(--color-danger-700);
  border: 1px solid var(--color-danger-200);
}

.status-badge.active {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
  border: 1px solid var(--color-success-200);
}

.status-badge.inactive {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-200);
}
</style>
