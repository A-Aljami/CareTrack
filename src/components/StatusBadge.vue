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
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.3px;
}

.status-badge.scheduled {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-badge.checked-in {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-badge.completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.pending {
  background-color: #fce4ec;
  color: #c2185b;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-badge.inactive {
  background-color: #f5f5f5;
  color: #757575;
}
</style>
