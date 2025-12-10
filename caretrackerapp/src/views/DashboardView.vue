<template>
  <div class="dashboard">
    <!-- Loading Spinner -->
    <LoadingSpinner v-if="appointmentsStore.isLoading" message="Loading appointments..." />

    <!-- Dashboard Content -->
    <template v-else>
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-left">
          <h1>Appointments</h1>
          <p class="subtitle">Comprehensive insights into patient care, department performance, and hospital efficiency metrics.</p>
        </div>
      </div>

    <!-- Calendar Controls -->
    <div class="calendar-controls">
      <div class="date-navigator">
        <button class="nav-btn" @click="previousPeriod">&lt;</button>
        <div class="current-period">
          <span class="period-label">{{ currentPeriodLabel }}</span>
        </div>
        <button class="nav-btn" @click="nextPeriod">&gt;</button>
      </div>
      <div class="filters">
        <select class="filter-select" v-model="statusFilter">
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="checked-in">Checked-In</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>

    <!-- Week Calendar Grid -->
    <div class="calendar-grid">
      <!-- Day Headers -->
      <div class="day-headers">
        <div class="time-column-header"></div>
        <div
          v-for="day in weekDays"
          :key="day.date"
          :class="['day-header', { 'today': isToday(day.date) }]"
        >
          <div class="day-name">{{ day.dayName }} {{ day.dayNum }}</div>
        </div>
      </div>

      <!-- Time Grid -->
      <div class="time-grid">
        <div v-for="hour in timeSlots" :key="hour" class="time-row">
          <div class="time-label">{{ formatHour(hour) }}</div>
          <div
            v-for="day in weekDays"
            :key="`${day.date}-${hour}`"
            class="time-cell"
          >
            <!-- Appointments in this time slot -->
            <div
              v-for="appointment in getAppointmentsForSlot(day.date, hour)"
              :key="appointment.id"
              :class="['appointment-block', `status-${appointment.status}`]"
              @click="viewAppointment(appointment)"
            >
              <div class="appointment-time">{{ appointment.time }}</div>
              <div class="appointment-patient">
                <span class="patient-avatar">{{ appointment.patientName.charAt(0) }}</span>
                <span class="patient-name">{{ appointment.patientName }}</span>
              </div>
              <div class="appointment-reason">{{ appointment.reason }}</div>
              <StatusBadge :status="appointment.status" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="stats-summary">
      <BaseCard class="stat-card">
        <h3>Total Appointments</h3>
        <p class="stat-number">{{ filteredWeekAppointments.length }}</p>
      </BaseCard>
      <BaseCard class="stat-card">
        <h3>Checked-In</h3>
        <p class="stat-number">{{ checkedInCount }}</p>
      </BaseCard>
      <BaseCard class="stat-card">
        <h3>Completed</h3>
        <p class="stat-number">{{ completedCount }}</p>
      </BaseCard>
    </div>

    <!-- Appointment Details Modal -->
    <div v-if="selectedAppointment" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Appointment Details</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
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
              <option value="scheduled">Scheduled</option>
              <option value="checked-in">Checked-In</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-save" @click="saveAppointment">Save Changes</button>
          <button class="btn-cancel" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import BaseCard from '@/components/BaseCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const appointmentsStore = useAppointmentsStore()
const currentWeekOffset = ref(0)
const statusFilter = ref('all')
const selectedAppointment = ref(null)

const appointments = computed(() => appointmentsStore.appointments)

// Time slots from 9 AM to 5 PM
const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17]

// Get current week's days
const weekDays = computed(() => {
  const days = []
  const today = new Date()
  const currentWeekStart = new Date(today)
  currentWeekStart.setDate(today.getDate() - today.getDay() + (currentWeekOffset.value * 7))

  for (let i = 0; i < 5; i++) { // Mon-Fri
    const day = new Date(currentWeekStart)
    day.setDate(currentWeekStart.getDate() + i + 1) // +1 to start from Monday

    days.push({
      date: day.toISOString().split('T')[0],
      dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: day.getDate(),
      fullDate: day
    })
  }
  return days
})

// Get appointments for the current week
const weekAppointments = computed(() => {
  const weekStart = weekDays.value[0]?.date
  const weekEnd = weekDays.value[4]?.date

  return appointments.value.filter(apt => {
    return apt.date >= weekStart && apt.date <= weekEnd
  })
})

const currentPeriodLabel = computed(() => {
  if (weekDays.value.length === 0) return ''
  const firstDay = weekDays.value[0].fullDate
  const lastDay = weekDays.value[4].fullDate

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long' })
  const year = firstDay.getFullYear()

  return `${monthName} ${year} - Week ${getWeekOfMonth(firstDay)}`
})

function getWeekOfMonth(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const dayOfMonth = date.getDate()
  const weekNumber = Math.ceil((dayOfMonth + firstDayOfMonth.getDay()) / 7)
  return weekNumber
}

// Apply status filter to weekAppointments
const filteredWeekAppointments = computed(() => {
  if (statusFilter.value === 'all') return weekAppointments.value
  return weekAppointments.value.filter(a => a.status === statusFilter.value)
})

const checkedInCount = computed(() => {
  return filteredWeekAppointments.value.filter(a => a.status === 'checked-in').length
})

const completedCount = computed(() => {
  return filteredWeekAppointments.value.filter(a => a.status === 'completed').length
})

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function isToday(dateString) {
  const today = new Date().toISOString().split('T')[0]
  return dateString === today
}

function formatHour(hour) {
  if (hour === 12) return '12 PM'
  if (hour > 12) return `${hour - 12} PM`
  return `${hour} AM`
}

function getAppointmentsForSlot(date, hour) {
  const filtered = appointments.value.filter(apt => {
    if (apt.date !== date) return false

    const aptHour = parseInt(apt.time.split(':')[0])
    if (aptHour !== hour) return false

    // Apply status filter
    if (statusFilter.value === 'all') return true
    return apt.status === statusFilter.value
  })

  // Debug logging
  if (filtered.length > 0) {
    console.log(`Found ${filtered.length} appointments for ${date} at ${hour}:00`, filtered)
  }

  return filtered
}

function previousPeriod() {
  currentWeekOffset.value--
}

function nextPeriod() {
  currentWeekOffset.value++
}

function viewAppointment(appointment) {
  // Create a copy of the appointment to avoid direct mutation
  selectedAppointment.value = { ...appointment }
}

function closeModal() {
  selectedAppointment.value = null
}

function saveAppointment() {
  if (selectedAppointment.value) {
    appointmentsStore.updateAppointmentStatus(
      selectedAppointment.value.id,
      selectedAppointment.value.status
    )
    closeModal()
  }
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  appointmentsStore.fetchAppointments()
  console.log('Dashboard mounted - All appointments:', appointments.value)
  console.log('Current week days:', weekDays.value)
})
</script>

<style scoped>
.dashboard {
  padding: 1rem;
  max-width: 100%;
  background-color: #f8f9fa;
  height: calc(100vh - 70px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.header-left h1 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  color: #1a1a1a;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.header-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-selector {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

/* Calendar Controls */
.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.date-navigator {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f3f4f6;
}

.period-label {
  font-weight: 600;
  color: #1a1a1a;
  min-width: 100px;
  text-align: center;
}

.filters {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Calendar Grid */
.calendar-grid {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 0.75rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.day-headers {
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  border-bottom: 2px solid #e5e7eb;
  background: #f9fafb;
}

.time-column-header {
  border-right: 1px solid #e5e7eb;
}

.day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #374151;
  border-right: 1px solid #e5e7eb;
}

.day-header.today {
  background: #dbeafe;
  color: #1e40af;
}

.day-name {
  font-size: 0.875rem;
}

/* Time Grid */
.time-grid {
  overflow-y: auto;
  flex: 1;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.time-grid::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.time-row {
  display: grid;
  grid-template-columns: 80px repeat(5, 1fr);
  border-bottom: 1px solid #f3f4f6;
  min-height: 60px;
}

.time-label {
  padding: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  border-right: 1px solid #e5e7eb;
  background: #f9fafb;
}

.time-cell {
  border-right: 1px solid #f3f4f6;
  padding: 0.5rem;
  position: relative;
  background: white;
  min-height: 60px;
  overflow: visible;
}

.time-cell:hover {
  background: #f9fafb;
}

/* Appointment Blocks */
.appointment-block {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid;
  font-size: 0.7rem;
}

.appointment-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.status-scheduled {
  background: #fef3c7;
  border-left-color: #f59e0b;
}

.status-checked-in {
  background: #dbeafe;
  border-left-color: #3b82f6;
}

.status-completed {
  background: #d1fae5;
  border-left-color: #10b981;
}

.appointment-time {
  font-size: 0.7rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.appointment-patient {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.patient-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.patient-name {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.8rem;
}

.appointment-reason {
  color: #6b7280;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
}

/* Stats Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  flex-shrink: 0;
}

.stat-card {
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.25rem 0;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4CAF50;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6b7280;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-value {
  color: #1a1a1a;
  font-size: 1rem;
}

.status-select {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.status-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #f0f0f0;
  justify-content: flex-end;
}

.btn-save,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-save {
  background: #4CAF50;
  color: white;
}

.btn-save:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #e5e7eb;
  color: #1a1a1a;
}
</style>