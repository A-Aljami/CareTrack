import { mockPatients, mockAppointments } from '@/data/mockData'

export const api = {
  async getAppointments() {
    return mockAppointments
  },

  async getPatients() {
    return mockPatients
  }
}