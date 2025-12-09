<template>
  <div class="patients">
    <h1>Patients List</h1>
    
    <input 
      v-model="searchQuery" 
      type="text" 
      placeholder="Search by name or medical ID..."
      class="search-input"
    />

    <div class="patients-list">
      <div 
        v-for="patient in filteredPatients" 
        :key="patient.id" 
        class="patient-card"
        @click="viewPatient(patient.id)"
      >
        <h3>{{ patient.name }}</h3>
        <p><strong>Age:</strong> {{ patient.age }}</p>
        <p><strong>Gender:</strong> {{ patient.gender }}</p>
        <p><strong>Medical ID:</strong> {{ patient.medicalId }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePatientsStore } from '@/stores/patients'
import { useRouter } from 'vue-router'

const patientsStore = usePatientsStore()
const router = useRouter()

const searchQuery = ref('')

const filteredPatients = computed(() => {
  if (!searchQuery.value) {
    return patientsStore.patients
  }
  const query = searchQuery.value.toLowerCase()
  return patientsStore.patients.filter(patient => 
    patient.name.toLowerCase().includes(query) || 
    patient.medicalId.toLowerCase().includes(query)
  )
})

function viewPatient(id) {
  router.push(`/patients/${id}`)
}

onMounted(() => {
  patientsStore.fetchPatients()
})
</script>

<style scoped>
.patients {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: calc(60px + 2rem);
}

h1 {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center; 
  color: #333;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.patients-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.patient-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
}

.patient-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.patient-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.patient-card p {
  margin: 0.25rem 0;
  color: #666;
}
</style>