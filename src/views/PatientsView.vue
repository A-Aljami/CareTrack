<template>
  <div class="patients">
    <LoadingSpinner v-if="patientsStore.isLoading" message="Loading patients..." />

    <ErrorState
      v-else-if="patientsStore.error"
      :message="patientsStore.error"
      @retry="handleRetry"
    />

    <template v-else>
      <div class="patients-header">
        <div class="header-content">
          <h1>Patients</h1>
          <p class="subtitle">Manage and view patient information</p>
        </div>
        <BaseButton variant="primary" @click="addPatient">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Patient
        </BaseButton>
      </div>

      <div class="search-section">
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or medical ID..."
            class="search-input"
          />
        </div>
        <div class="results-count">
          {{ filteredPatients.length }} {{ filteredPatients.length === 1 ? 'patient' : 'patients' }}
        </div>
      </div>

      <div class="patients-grid">
        <BaseCard
          v-for="patient in filteredPatients"
          :key="patient.id"
          hoverable
          clickable
          @click="viewPatient(patient.id)"
          class="patient-card"
        >
          <div class="patient-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div class="patient-info">
            <h3 class="patient-name">{{ patient.name }}</h3>
            <div class="patient-details">
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{{ patient.age }} years</span>
              </div>
              <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{{ patient.gender }}</span>
              </div>
            </div>
            <div class="medical-id">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span>{{ patient.medicalId }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePatientsStore } from '@/stores/patients'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorState from '@/components/ErrorState.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'

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

function addPatient() {
  // TODO: Implement add patient functionality
  console.log('Add patient clicked')
}

function handleRetry() {
  patientsStore.retryFetch()
}

onMounted(() => {
  patientsStore.fetchPatients()
})
</script>

<style scoped>
.patients {
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-background-secondary);
  padding: var(--spacing-8);
}

/* Header Section */
.patients-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-8);
}

.header-content h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Search Section */
.search-section {
  display: flex;
  gap: var(--spacing-4);
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.search-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--spacing-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4) var(--spacing-3) calc(var(--spacing-4) + 28px);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.results-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

/* Patients Grid */
.patients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-6);
}

.patient-card :deep(.card-body) {
  display: flex;
  gap: var(--spacing-6);
  align-items: flex-start;
}

.patient-avatar {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.patient-info {
  flex: 1;
  min-width: 0;
}

.patient-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-3) 0;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-3);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.detail-item svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.medical-id {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-background-tertiary);
  border-radius: var(--radius-base);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-mono);
  width: fit-content;
}

.medical-id svg {
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .patients-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .patients {
    padding: var(--spacing-6);
  }

  .patients-header {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: stretch;
  }

  .search-section {
    flex-direction: column;
    align-items: stretch;
  }

  .patients-grid {
    grid-template-columns: 1fr;
  }
}
</style>