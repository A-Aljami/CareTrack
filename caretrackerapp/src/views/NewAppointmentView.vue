<template>
  <div class="new-appointment">
    <h1>New Appointment</h1>

    <div class="form-card">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Patient:</label>
          <select v-model.number="appointment.patientId" required>
            <option value="">Select patient...</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} ({{ patient.medicalId }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Date:</label>
          <input v-model="appointment.date" type="date" required />
        </div>

        <div class="form-group">
          <label>Time:</label>
          <input v-model="appointment.time" type="time" required />
        </div>

        <div class="form-group">
          <label>Reason:</label>
          <textarea v-model="appointment.reason" rows="4" required></textarea>
        </div>

        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>

        <BaseButton type="submit" variant="success" full-width>Create Appointment</BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useAppointmentsStore } from '@/stores/appointments'
import { APPOINTMENT_STATUS } from '@/constants/appointmentStatus'
import BaseButton from '@/components/BaseButton.vue'

const router = useRouter()
const patientsStore = usePatientsStore()
const appointmentsStore = useAppointmentsStore()

const patients = computed(() => patientsStore.patients)

const appointment = ref({
  patientId: '',
  date: '',
  time: '',
  reason: ''
})

const errorMessage = ref('')

function handleSubmit() {
  errorMessage.value = ''

  const selectedDate = new Date(appointment.value.date + 'T' + appointment.value.time)
  const now = new Date()

  if (selectedDate < now) {
    errorMessage.value = 'Date and time cannot be in the past'
    return
  }

  const patient = patientsStore.getPatientById(appointment.value.patientId)

  const newAppointment = {
    id: String(Date.now()),
    patientId: String(appointment.value.patientId),
    patientName: patient.name,
    date: appointment.value.date,
    time: appointment.value.time,
    reason: appointment.value.reason,
    status: APPOINTMENT_STATUS.SCHEDULED
  }

  appointmentsStore.addAppointment(newAppointment)

  router.push('/dashboard')
  window.scrollTo(0, 0)
}

onMounted(() => {
  patientsStore.fetchPatients()
})
</script>

<style scoped>
.new-appointment {
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.form-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
  font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

</style>
