<template>
  <div class="dashboard">
    <h1>Dashboard - {{ todayDate }}</h1>
    
    <div class="summary">
      <div class="stat-card">
        <h3>Total Appointments</h3>
        <p class="stat-number">{{ appointments.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Checked-In</h3>
        <p class="stat-number">{{ checkedInCount }}</p>
      </div>
      <div class="stat-card">
        <h3>Completed</h3>
        <p class="stat-number">{{ completedCount }}</p>
      </div>
    </div>

    <h2>Today's Appointments</h2>
    <div class="appointments-list">
      <div v-for="appointment in appointments" :key="appointment.id" class="appointment-card">
        <div class="appointment-info">
          <h3>{{ appointment.patientName }}</h3>
          <p><strong>Time:</strong> {{ appointment.time }}</p>
          <p><strong>Reason:</strong> {{ appointment.reason }}</p>
        </div>
        <div class="appointment-status">
          <label>Status:</label>
          <select v-model="appointment.status" @change="updateStatus(appointment.id, appointment.status)">
            <option value="scheduled">Scheduled</option>
            <option value="checked-in">Checked-In</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'

const appointmentsStore = useAppointmentsStore()

const todayDate = new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})

const appointments = computed(() => appointmentsStore.appointments)

const checkedInCount = computed(() => {
  return appointments.value.filter(a => a.status === 'checked-in').length
})

const completedCount = computed(() => {
  return appointments.value.filter(a => a.status === 'completed').length
})

function updateStatus(id, newStatus) {
  appointmentsStore.updateAppointmentStatus(id, newStatus)
}

onMounted(() => {
  appointmentsStore.fetchAppointments()
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: calc(60px + 2rem);
}

h1 {
  padding-top: 4rem;
  margin-top: 0;
  margin-bottom: 2rem;
  color: #333;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 0;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.appointment-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.appointment-info p {
  margin: 0.25rem 0;
  color: #666;
}

.appointment-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.appointment-status label {
  font-weight: bold;
  color: #666;
}

.appointment-status select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
</style>