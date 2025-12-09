import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])

  async function fetchAppointments() {
    const data = await api.getAppointments()
    appointments.value = data
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
    fetchAppointments,
    setAppointments,
    addAppointment,
    updateAppointmentStatus
  }
})