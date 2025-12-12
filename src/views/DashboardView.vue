<template>
  <div class="dashboard">
    <LoadingSpinner v-if="appointmentsStore.isLoading" message="Loading appointments..." />

    <ErrorState
      v-else-if="appointmentsStore.error"
      :message="appointmentsStore.error"
      @retry="handleRetry"
    />

    <template v-else>
      <div class="dashboard-layout">
        <!-- Left Panel: Mini Calendar & Filters -->
        <aside class="left-panel">
          <!-- Mini Calendar -->
          <div class="mini-calendar-section">
            <div class="section-header">
              <h3>{{ selectedMonth }}</h3>
              <div class="month-nav">
                <button @click="previousMonth" class="month-nav-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button @click="nextMonth" class="month-nav-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <div class="mini-calendar">
              <div class="mini-calendar-header">
                <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" class="mini-day-label">
                  {{ day }}
                </div>
              </div>
              <div class="mini-calendar-days">
                <button
                  v-for="day in calendarDays"
                  :key="day.date"
                  :class="[
                    'mini-day',
                    {
                      'other-month': !day.isCurrentMonth,
                      'today': day.isToday,
                      'selected': day.isSelected,
                      'has-events': day.hasEvents
                    }
                  ]"
                  @click="selectDate(day)"
                  :disabled="!day.isCurrentMonth"
                >
                  <span class="mini-day-number">{{ day.dayNum }}</span>
                  <span v-if="day.hasEvents" class="event-indicator"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Status Filters -->
          <div class="filters-section">
            <div class="section-header">
              <h3>Status Filter</h3>
            </div>
            <div class="filter-options">
              <button
                v-for="filter in statusFilters"
                :key="filter.value"
                :class="['filter-btn', { 'active': statusFilter === filter.value }]"
                @click="statusFilter = filter.value"
              >
                <span :class="['filter-dot', filter.color]"></span>
                <span>{{ filter.label }}</span>
                <span class="filter-count">{{ getStatusCount(filter.value) }}</span>
              </button>
            </div>
          </div>

        </aside>

        <!-- Main Content: Calendar -->
        <main class="main-content">
          <div class="calendar-header">
            <div class="header-title">
              <h1>Appointments</h1>
              <button class="today-btn" @click="goToToday">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Today
              </button>
            </div>
            <div class="header-controls">
              <div class="week-navigator">
                <button class="nav-btn" @click="previousWeek">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <span class="week-label">{{ currentWeekLabel }}</span>
                <button class="nav-btn" @click="nextWeek">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
              <select v-model="viewMode" class="view-select">
                <option value="day">Day</option>
                <option value="week">Week</option>
              </select>
            </div>
          </div>

          <div class="calendar-container">
            <div class="calendar-grid" :class="`view-${viewMode}`">
              <!-- Day Headers -->
              <div class="day-headers">
                <div class="time-column-header"></div>
                <div
                  v-for="day in weekDays"
                  :key="day.date"
                  :class="['day-header', { 'today': isToday(day.date) }]"
                >
                  <div class="day-label">{{ day.dayName }}</div>
                  <div class="day-number">{{ day.dayNum }}</div>
                </div>
              </div>

              <!-- Time Grid -->
              <div class="time-grid-container">
                <div v-for="hour in timeSlots" :key="hour" class="time-row">
                  <div class="time-label">{{ formatHour(hour) }}</div>
                  <div
                    v-for="day in weekDays"
                    :key="`${day.date}-${hour}`"
                    class="time-cell"
                  >
                    <div
                      v-for="appointment in getAppointmentsForSlot(day.date, hour)"
                      :key="appointment.id"
                      :class="['appointment-card', `status-${appointment.status}`]"
                      @click="viewAppointment(appointment)"
                    >
                      <div class="appointment-time">{{ appointment.time }}</div>
                      <div class="appointment-title">{{ appointment.patientName }}</div>
                      <div class="appointment-subtitle">{{ appointment.reason }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <!-- Right Panel: Upcoming Appointments -->
        <aside class="right-panel">
          <div class="section-header">
            <h3>Upcoming</h3>
          </div>

          <div class="upcoming-list">
            <div class="upcoming-section">
              <div class="upcoming-date-label">Today</div>
              <div
                v-for="apt in todayAppointments"
                :key="apt.id"
                :class="['upcoming-card', `status-${apt.status}`]"
                @click="viewAppointment(apt)"
              >
                <div class="upcoming-icon" :style="{ backgroundColor: getStatusColor(apt.status) }">
                  {{ apt.patientName.charAt(0) }}
                </div>
                <div class="upcoming-info">
                  <div class="upcoming-title">{{ apt.reason }}</div>
                  <div class="upcoming-time">{{ apt.time }}</div>
                </div>
                <div class="upcoming-date">{{ formatShortDate(apt.date) }}</div>
              </div>
            </div>

            <div v-if="tomorrowAppointments.length > 0" class="upcoming-section">
              <div class="upcoming-date-label">Tomorrow</div>
              <div
                v-for="apt in tomorrowAppointments"
                :key="apt.id"
                :class="['upcoming-card', `status-${apt.status}`]"
                @click="viewAppointment(apt)"
              >
                <div class="upcoming-icon" :style="{ backgroundColor: getStatusColor(apt.status) }">
                  {{ apt.patientName.charAt(0) }}
                </div>
                <div class="upcoming-info">
                  <div class="upcoming-title">{{ apt.reason }}</div>
                  <div class="upcoming-time">{{ apt.time }}</div>
                </div>
                <div class="upcoming-date">{{ formatShortDate(apt.date) }}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- Appointment Details Modal -->
      <div v-if="selectedAppointment" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Appointment Details</h2>
            <button class="close-btn" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="detail-row">
              <span class="detail-label">Patient:</span>
              <span class="detail-value">{{ selectedAppointment.patientName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(selectedAppointment.date) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">{{ selectedAppointment.time }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Reason:</span>
              <span class="detail-value">{{ selectedAppointment.reason }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <select v-model="selectedAppointment.status" class="status-select">
                <option :value="APPOINTMENT_STATUS.SCHEDULED">Scheduled</option>
                <option :value="APPOINTMENT_STATUS.CHECKED_IN">Checked-In</option>
                <option :value="APPOINTMENT_STATUS.COMPLETED">Completed</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
            <BaseButton variant="primary" @click="saveAppointment">Save Changes</BaseButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import { formatDate, formatHour } from '@/utils/formatters'
import BaseButton from '@/components/BaseButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorState from '@/components/ErrorState.vue'

const appointmentsStore = useAppointmentsStore()
const currentWeekOffset = ref(0)
const currentMonthOffset = ref(0)
const statusFilter = ref('all')
const selectedAppointment = ref(null)
const selectedDate = ref(new Date())
const viewMode = ref('day')

const appointments = computed(() => appointmentsStore.appointments)
const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17]

const statusFilters = [
  { value: 'all', label: 'All Status', color: 'gray' },
  { value: APPOINTMENT_STATUS.SCHEDULED, label: 'Scheduled', color: 'blue' },
  { value: APPOINTMENT_STATUS.CHECKED_IN, label: 'Checked-In', color: 'orange' },
  { value: APPOINTMENT_STATUS.COMPLETED, label: 'Completed', color: 'green' }
]

// Mini Calendar Logic
const selectedMonth = computed(() => {
  const date = new Date()
  date.setMonth(date.getMonth() + currentMonthOffset.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const days = []
  const today = new Date()
  const currentDate = new Date()
  currentDate.setMonth(currentDate.getMonth() + currentMonthOffset.value)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const totalDays = lastDay.getDate()

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  for (let i = startDay - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    days.push({
      dayNum: dayNum,
      date: dateStr,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasEvents: false
    })
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    // Create date string directly without timezone conversion
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`

    // For comparison, create date strings in the same way
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const selectedStr = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.value.getDate()).padStart(2, '0')}`

    days.push({
      dayNum: i,
      date: dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedStr,
      hasEvents: appointments.value.some(apt => apt.date === dateStr)
    })
  }

  // Next month days
  const remainingDays = 42 - days.length
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  for (let i = 1; i <= remainingDays; i++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      dayNum: i,
      date: dateStr,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasEvents: false
    })
  }

  return days
})

// Week View Logic - Shows single day or week based on view mode
const weekDays = computed(() => {
  const days = []

  if (viewMode.value === 'week') {
    // Week view: show Monday-Friday
    const baseDate = new Date(selectedDate.value)
    const dayOfWeek = baseDate.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const monday = new Date(baseDate)
    monday.setDate(baseDate.getDate() + mondayOffset + (currentWeekOffset.value * 7))

    for (let i = 0; i < 5; i++) {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)

      // Create date string without timezone conversion
      const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`

      days.push({
        date: dateStr,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: day.getDate(),
        fullDate: day
      })
    }
  } else {
    // Day view: show only the selected day
    const day = new Date(selectedDate.value)
    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`

    days.push({
      date: dateStr,
      dayName: day.toLocaleDateString('en-US', { weekday: 'long' }),
      dayNum: day.getDate(),
      fullDate: day
    })
  }

  return days
})

const currentWeekLabel = computed(() => {
  if (weekDays.value.length === 0) return ''
  const firstDay = weekDays.value[0].fullDate
  const lastDay = weekDays.value[weekDays.value.length - 1].fullDate

  const options = { month: 'short', day: 'numeric' }

  // For single day view, show just the date
  if (viewMode.value === 'day') {
    return firstDay.toLocaleDateString('en-US', options)
  }

  // For week view, show range
  return `${firstDay.toLocaleDateString('en-US', options)} - ${lastDay.toLocaleDateString('en-US', options)}`
})

const filteredWeekAppointments = computed(() => {
  if (weekDays.value.length === 0) return []

  const weekStart = weekDays.value[0]?.date
  const weekEnd = weekDays.value[weekDays.value.length - 1]?.date

  let filtered = appointments.value.filter(apt => apt.date >= weekStart && apt.date <= weekEnd)

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(apt => apt.status === statusFilter.value)
  }

  return filtered
})

const todayAppointments = computed(() => {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return appointments.value.filter(apt => apt.date === todayStr).slice(0, 3)
})

const tomorrowAppointments = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
  return appointments.value.filter(apt => apt.date === tomorrowStr).slice(0, 3)
})

function getStatusCount(status) {
  if (status === 'all') return filteredWeekAppointments.value.length
  return filteredWeekAppointments.value.filter(apt => apt.status === status).length
}

function getStatusColor(status) {
  const colors = {
    [APPOINTMENT_STATUS.SCHEDULED]: 'var(--color-primary-500)',
    [APPOINTMENT_STATUS.CHECKED_IN]: 'var(--color-warning-500)',
    [APPOINTMENT_STATUS.COMPLETED]: 'var(--color-success-500)'
  }
  return colors[status] || 'var(--color-gray-400)'
}

function selectDate(day) {
  if (!day.isCurrentMonth) return
  // Create date from ISO string properly to avoid timezone issues
  const [year, month, dayNum] = day.date.split('-').map(Number)
  selectedDate.value = new Date(year, month - 1, dayNum)
  currentWeekOffset.value = 0
}

function previousMonth() {
  currentMonthOffset.value--
}

function nextMonth() {
  currentMonthOffset.value++
}

function previousWeek() {
  currentWeekOffset.value--
}

function nextWeek() {
  currentWeekOffset.value++
}

function goToToday() {
  selectedDate.value = new Date()
  currentWeekOffset.value = 0
  currentMonthOffset.value = 0
}

function isToday(date) {
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  return date === todayStr
}

function getAppointmentsForSlot(date, hour) {
  return filteredWeekAppointments.value.filter(apt => {
    if (apt.date !== date) return false
    const aptHour = parseInt(apt.time.split(':')[0])
    return aptHour === hour
  })
}

function viewAppointment(appointment) {
  selectedAppointment.value = { ...appointment }
}

function closeModal() {
  selectedAppointment.value = null
}

function saveAppointment() {
  appointmentsStore.updateAppointment(selectedAppointment.value)
  closeModal()
}

function formatShortDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function handleRetry() {
  await appointmentsStore.fetchAppointments()
}

onMounted(async () => {
  await appointmentsStore.fetchAppointments()
})
</script>

<style scoped>
.dashboard {
  height: 100%;
  background-color: var(--color-background-secondary);
  overflow: hidden;
}

.dashboard-layout {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: var(--spacing-6);
  height: 100%;
  padding: var(--spacing-6);
  overflow: hidden;
}

/* ============================================
   LEFT PANEL - Mini Calendar & Filters
   ============================================ */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  overflow-y: auto;
  padding-right: var(--spacing-2);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.section-header h3 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.month-nav {
  display: flex;
  gap: var(--spacing-1);
}

.month-nav-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-background-tertiary);
  border-radius: var(--radius-base);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.month-nav-btn:hover {
  background: var(--color-gray-200);
  color: var(--color-text-primary);
}

.mini-calendar {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  border: 1px solid var(--color-border);
}

.mini-calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-2);
}

.mini-day-label {
  text-align: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  padding: var(--spacing-1);
}

.mini-calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-1);
}

.mini-day {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.mini-day-number {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-normal);
}

.mini-day.other-month .mini-day-number {
  color: var(--color-text-disabled);
}

.mini-day:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.mini-day:not(.other-month):not(:disabled):hover {
  background: var(--color-primary-50);
}

.mini-day.today {
  background: var(--color-primary-500);
}

.mini-day.today .mini-day-number {
  color: white;
  font-weight: var(--font-weight-semibold);
}

.mini-day.selected {
  background: var(--color-primary-100);
  border: 2px solid var(--color-primary-500);
}

.mini-day.has-events::after {
  content: '';
  position: absolute;
  bottom: 2px;
  width: 4px;
  height: 4px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
}

.mini-day.today.has-events::after {
  background: white;
}

/* Filter Options */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.filter-btn:hover {
  background: var(--color-background-tertiary);
  border-color: var(--color-border-strong);
}

.filter-btn.active {
  background: var(--color-primary-50);
  border-color: var(--color-primary-500);
  color: var(--color-primary-700);
}

.filter-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.filter-dot.gray {
  background: var(--color-gray-400);
}

.filter-dot.blue {
  background: var(--color-primary-500);
}

.filter-dot.orange {
  background: var(--color-warning-500);
}

.filter-dot.green {
  background: var(--color-success-500);
}

.filter-count {
  margin-left: auto;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-tertiary);
  background: var(--color-background-tertiary);
  padding: 2px var(--spacing-2);
  border-radius: var(--radius-full);
}

/* ============================================
   MAIN CONTENT - Calendar
   ============================================ */
.main-content {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.calendar-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.header-title h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.today-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: var(--color-background-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.today-btn:hover {
  background: var(--color-gray-200);
  color: var(--color-text-primary);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.week-navigator {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.nav-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  border-radius: var(--radius-base);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: var(--color-background-tertiary);
  border-color: var(--color-border-strong);
  color: var(--color-text-primary);
}

.week-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  min-width: 140px;
  text-align: center;
}

.view-select {
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  background: var(--color-surface);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  cursor: pointer;
}

.calendar-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.calendar-grid {
  min-width: 100%;
}

.day-headers {
  display: grid;
  gap: 1px;
  background: var(--color-border);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Day view: 1 column */
.calendar-grid.view-day .day-headers {
  grid-template-columns: 80px 1fr;
}

/* Week view: 5 columns */
.calendar-grid.view-week .day-headers {
  grid-template-columns: 80px repeat(5, 1fr);
}

.time-column-header {
  background: var(--color-surface);
  padding: var(--spacing-4);
}

.day-header {
  background: var(--color-surface);
  padding: var(--spacing-4);
  text-align: center;
}

.day-header.today {
  background: var(--color-primary-50);
}

.day-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.day-number {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-top: var(--spacing-1);
}

.day-header.today .day-number {
  color: var(--color-primary-600);
}

.time-grid-container {
  background: var(--color-background-secondary);
}

.time-row {
  display: grid;
  gap: 1px;
  background: var(--color-border);
  min-height: 80px;
}

/* Day view: 1 column */
.calendar-grid.view-day .time-row {
  grid-template-columns: 80px 1fr;
}

/* Week view: 5 columns */
.calendar-grid.view-week .time-row {
  grid-template-columns: 80px repeat(5, 1fr);
}

.time-label {
  background: var(--color-surface);
  padding: var(--spacing-3);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-align: right;
  font-weight: var(--font-weight-medium);
}

.time-cell {
  background: var(--color-surface);
  padding: var(--spacing-2);
  position: relative;
  min-height: 80px;
}

.appointment-card {
  padding: var(--spacing-3);
  border-radius: var(--radius-base);
  border-left: 3px solid;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: var(--spacing-2);
}

.appointment-card:last-child {
  margin-bottom: 0;
}

.appointment-card.status-scheduled {
  background: var(--color-primary-50);
  border-color: var(--color-primary-500);
}

.appointment-card.status-checked-in {
  background: var(--color-warning-50);
  border-color: var(--color-warning-500);
}

.appointment-card.status-completed {
  background: var(--color-success-50);
  border-color: var(--color-success-500);
}

.appointment-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.appointment-time {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-1);
}

.appointment-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.appointment-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ============================================
   RIGHT PANEL - Upcoming Appointments
   ============================================ */
.right-panel {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-left: var(--spacing-2);
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.upcoming-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.upcoming-date-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.upcoming-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.upcoming-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-strong);
}

.upcoming-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  color: white;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  flex-shrink: 0;
}

.upcoming-info {
  flex: 1;
  min-width: 0;
}

.upcoming-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.upcoming-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* ============================================
   MODAL
   ============================================ */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-6);
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--color-background-tertiary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.detail-row {
  display: flex;
  padding: var(--spacing-4) 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  flex: 0 0 120px;
  font-size: var(--font-size-sm);
}

.detail-value {
  color: var(--color-text-primary);
  flex: 1;
  font-size: var(--font-size-sm);
}

.status-select {
  flex: 1;
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: var(--color-surface);
}

.modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .dashboard-layout {
    grid-template-columns: 260px 1fr 280px;
  }
}

@media (max-width: 1200px) {
  .dashboard-layout {
    grid-template-columns: 1fr 300px;
  }

  .left-panel {
    display: none;
  }
}

@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }

  .right-panel {
    display: none;
  }
}
</style>
