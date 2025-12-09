import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref([])

  function setPatients(data) {
    patients.value = data
  }

  function getPatientById(id) {
    return patients.value.find(p => p.id === id)
  }

  async function fetchPatients() {
    const data = await api.getPatients()
    patients.value = data
  }

  return {
    patients,
    fetchPatients,
    setPatients,
    getPatientById
  }
})