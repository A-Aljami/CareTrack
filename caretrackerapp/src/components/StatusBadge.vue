<template>
  <span :class="['status-badge', status]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['scheduled', 'checked-in', 'completed', 'pending', 'active', 'inactive'].includes(value)
  }
})

const label = computed(() => {
  const labels = {
    'scheduled': 'Scheduled',
    'checked-in': 'Checked In',
    'completed': 'Completed',
    'pending': 'Pending',
    'active': 'Active',
    'inactive': 'Inactive'
  }
  return labels[props.status] || props.status
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

/* Scheduled status */
.status-badge.scheduled {
  background-color: #e3f2fd;
  color: #1976d2;
}

/* Checked-in status */
.status-badge.checked-in {
  background-color: #fff3e0;
  color: #f57c00;
}

/* Completed status */
.status-badge.completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

/* Pending status */
.status-badge.pending {
  background-color: #fce4ec;
  color: #c2185b;
}

/* Active status */
.status-badge.active {
  background-color: #e8f5e9;
  color: #388e3c;
}

/* Inactive status */
.status-badge.inactive {
  background-color: #f5f5f5;
  color: #757575;
}
</style>
