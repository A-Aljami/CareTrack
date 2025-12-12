import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref([])
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  function setPatients(data) {
    patients.value = data
  }

  function getPatientById(id) {
    return patients.value.find(p => p.id === id)
  }

  async function fetchPatients() {
    if (isLoaded.value) return

    isLoading.value = true
    error.value = null

    try {
      const data = await api.getPatients()
      patients.value = data
      isLoaded.value = true
    } catch (err) {
      error.value = err.message || 'An error occurred while fetching patients'
      console.error('Error fetching patients:', err)
    } finally {
      isLoading.value = false
    }
  }

  function retryFetch() {
    isLoaded.value = false
    return fetchPatients()
  }

  return {
    patients,
    isLoaded,
    isLoading,
    error,
    fetchPatients,
    retryFetch,
    setPatients,
    getPatientById
  }
})