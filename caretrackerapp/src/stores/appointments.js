import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])

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
    setAppointments,
    addAppointment,
    updateAppointmentStatus
  }
})