import { mockPatients, mockAppointments } from '@/data/mockData'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const shouldFail = () => Math.random() < 0.2

export const api = {
  async getAppointments() {
    await delay(1000 + Math.random() * 1000)

    if (shouldFail()) {
      throw new Error('Failed to fetch appointments. Please try again.')
    }

    return mockAppointments
  },

  async getPatients() {
    await delay(800 + Math.random() * 700)

    if (shouldFail()) {
      throw new Error('Failed to fetch patients. Please try again.')
    }

    return mockPatients
  }
}