import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchAppointments() {
    if (isLoaded.value) return

    isLoading.value = true
    error.value = null

    try {
      const data = await api.getAppointments()
      appointments.value = data
      isLoaded.value = true
    } catch (err) {
      error.value = err.message || 'An error occurred while fetching appointments'
      console.error('Error fetching appointments:', err)
    } finally {
      isLoading.value = false
    }
  }

  function retryFetch() {
    isLoaded.value = false
    return fetchAppointments()
  }

  function setAppointments(data) {
    appointments.value = data
  }

  function addAppointment(appointment) {
    appointments.value.push(appointment)
  }

  function updateAppointmentStatus(id, status) {
    const appointment = appointments.value.find(a => a.id === id)
    if (appointment) {
      appointment.status = status
    }
  }

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    retryFetch,
    setAppointments,
    addAppointment,
    updateAppointmentStatus
  }
})