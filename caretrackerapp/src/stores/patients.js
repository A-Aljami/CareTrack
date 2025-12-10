import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref([])
  const isLoading = ref(false)

  function setPatients(data) {
    patients.value = data
  }

  function getPatientById(id) {
    return patients.value.find(p => p.id === id)
  }

  async function fetchPatients() {
    isLoading.value = true
    try {
      const data = await api.getPatients()
      patients.value = data
    } finally {
      isLoading.value = false
    }
  }

  return {
    patients,
    isLoading,
    fetchPatients,
    setPatients,
    getPatientById
  }
})