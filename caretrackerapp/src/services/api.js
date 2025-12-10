import { mockPatients, mockAppointments } from '@/data/mockData'

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const api = {
  async getAppointments() {
    // Simulate 1-2 second loading time
    await delay(1000 + Math.random() * 1000)
    return mockAppointments
  },

  async getPatients() {
    // Simulate 800-1500ms loading time
    await delay(800 + Math.random() * 700)
    return mockPatients
  }
}