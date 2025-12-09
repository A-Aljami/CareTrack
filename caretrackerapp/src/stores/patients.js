import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref([])

  function setPatients(data) {
    patients.value = data
  }

  function getPatientById(id) {
    return patients.value.find(p => p.id === id)
  }

  return {
    patients,
    setPatients,
    getPatientById
  }
})