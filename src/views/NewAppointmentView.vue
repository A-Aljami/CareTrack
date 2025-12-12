<template>
  <div class="new-appointment">
    <div class="page-header">
      <BaseButton variant="ghost" size="sm" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Dashboard
      </BaseButton>
    </div>

    <div class="form-container">
      <div class="form-header">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"></path>
            <line x1="12" y1="14" x2="12" y2="18"></line>
            <line x1="10" y1="16" x2="14" y2="16"></line>
          </svg>
        </div>
        <h1>New Appointment</h1>
        <p class="subtitle">Schedule a new appointment for a patient</p>
      </div>

      <BaseCard class="form-card">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="patient">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Patient
              </label>
              <select id="patient" v-model.number="appointment.patientId" required class="form-input">
                <option value="" disabled>Select a patient...</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                  {{ patient.name }} ({{ patient.medicalId }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="date">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Date
              </label>
              <input id="date" v-model="appointment.date" type="date" required class="form-input" />
            </div>

            <div class="form-group">
              <label for="time">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Time
              </label>
              <input id="time" v-model="appointment.time" type="time" required class="form-input" />
            </div>

            <div class="form-group full-width">
              <label for="reason">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Reason for Visit
              </label>
              <textarea id="reason" v-model="appointment.reason" rows="4" required class="form-input" placeholder="Describe the reason for this appointment..."></textarea>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <BaseButton type="button" variant="ghost" @click="goBack">Cancel</BaseButton>
            <BaseButton type="submit" variant="primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Create Appointment
            </BaseButton>
          </div>
        </form>
      </BaseCard>
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
import BaseCard from '@/components/BaseCard.vue'

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

  // Validate working hours (9 AM - 5 PM)
  const selectedHour = parseInt(appointment.value.time.split(':')[0])

  if (selectedHour < 9 || selectedHour >= 17) {
    errorMessage.value = 'Appointments must be scheduled between 9:00 AM and 5:00 PM (working hours only)'
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

function goBack() {
  router.push('/dashboard')
}

onMounted(() => {
  patientsStore.fetchPatients()
})
</script>

<style scoped>
.new-appointment {
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-background-secondary);
  padding: var(--spacing-8);
}

.page-header {
  margin-bottom: var(--spacing-6);
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* Header Section */
.form-header {
  text-align: center;
  margin-bottom: var(--spacing-2);
}

.header-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--spacing-4);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-lg);
}

.form-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Form */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-5);
  margin-bottom: var(--spacing-6);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.form-group label svg {
  color: var(--color-text-tertiary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  font-family: var(--font-family-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

select.form-input {
  cursor: pointer;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  background: var(--color-danger-50);
  color: var(--color-danger-700);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-5);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-danger-200);
}

.error-message svg {
  flex-shrink: 0;
  color: var(--color-danger-500);
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  padding-top: var(--spacing-5);
  border-top: 1px solid var(--color-border);
}

/* Responsive Design */
@media (max-width: 768px) {
  .new-appointment {
    padding: var(--spacing-6);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: 1;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
