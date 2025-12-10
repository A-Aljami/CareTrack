import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const isLoaded = ref(false)
  const isLoading = ref(false)

  async function fetchAppointments() {
    if (isLoaded.value) return

    isLoading.value = true
    try {
      const data = await api.getAppointments()
      appointments.value = data
      isLoaded.value = true
    } finally {
      isLoading.value = false
    }
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
    fetchAppointments,
    setAppointments,
    addAppointment,
    updateAppointmentStatus
  }
})