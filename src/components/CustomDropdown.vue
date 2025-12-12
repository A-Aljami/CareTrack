<template>
  <div class="custom-dropdown" ref="dropdown">
    <button
      type="button"
      class="dropdown-trigger"
      @click="toggleDropdown"
      :class="{ 'open': isOpen }"
    >
      <span>{{ selectedLabel }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        :class="{ 'rotate': isOpen }"
      >
        <path fill="currentColor" d="M6 9L1 4h10z" />
      </svg>
    </button>
    <transition name="slide-down">
      <div v-if="isOpen" class="dropdown-menu">
        <div
          v-for="option in options"
          :key="option.value"
          class="dropdown-option"
          :class="{ 'selected': modelValue === option.value }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true,
    // Array of { value: string, label: string }
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const dropdown = ref(null)

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === props.modelValue)
  return option ? option.label : ''
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectOption(option) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function handleClickOutside(event) {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  outline: none;
  transition: all var(--transition-fast);
  min-width: 100px;
}

.dropdown-trigger:hover {
  border-color: var(--color-border-strong);
}

.dropdown-trigger svg {
  transition: transform var(--transition-fast);
  color: var(--color-text-secondary);
}

.dropdown-trigger svg.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-option {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropdown-option:hover {
  background: #1e3a8a;
  color: white;
}

.dark-mode .dropdown-option:hover {
  background: #293e60;
  color: white;
}

.dropdown-option.selected {
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: var(--font-weight-semibold);
}

.dark-mode .dropdown-option.selected {
  background: #1e293b;
  color: #93c5fd;
}

/* Slide down animation */
.slide-down-enter-active {
  animation: slideDown var(--transition-base);
}

.slide-down-leave-active {
  animation: slideDown var(--transition-base) reverse;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
