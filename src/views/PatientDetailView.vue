<template>
  <div class="patient-detail">
    <div v-if="patient">
      <!-- Header with Back Button -->
      <div class="page-header">
        <BaseButton variant="ghost" size="sm" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to Patients
        </BaseButton>
      </div>

      <div class="content-wrapper">
        <!-- Patient Profile Card -->
        <div class="patient-section">
          <BaseCard class="patient-card">
            <div class="patient-header">
              <div class="patient-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="patient-info">
                <h1>{{ patient.name }}</h1>
                <div class="medical-id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  {{ patient.medicalId }}
                </div>
              </div>
            </div>

            <div class="patient-stats">
              <div class="stat-card">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Age</div>
                  <div class="stat-value">{{ patient.age }} years</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Gender</div>
                  <div class="stat-value">{{ patient.gender }}</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-label">Total Visits</div>
                  <div class="stat-value">{{ patientNotes.length }}</div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Visit Notes Sidebar -->
        <div class="notes-section">
          <BaseCard class="notes-card">
            <template #header>
              <div class="notes-header">
                <h2>Visit Notes</h2>
                <BaseButton
                  variant="primary"
                  size="sm"
                  @click="showForm = !showForm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  {{ showForm ? 'Cancel' : 'Add Note' }}
                </BaseButton>
              </div>
            </template>

            <form v-if="showForm" @submit.prevent="handleSubmit" class="note-form">
              <div class="form-group">
                <label>Date</label>
                <input v-model="newNote.date" type="date" required class="form-input" />
              </div>

              <div class="form-group">
                <label>Visit Type</label>
                <select v-model="newNote.visitType" required class="form-input">
                  <option value="">Select type...</option>
                  <option value="Checkup">Checkup</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Lab Result Review">Lab Result Review</option>
                </select>
              </div>

              <div class="form-group">
                <label>Note</label>
                <textarea v-model="newNote.note" rows="3" required class="form-input"></textarea>
              </div>

              <div class="form-actions">
                <BaseButton type="button" variant="secondary" @click="showForm = false">Cancel</BaseButton>
                <BaseButton type="submit" variant="primary">Save Note</BaseButton>
              </div>
            </form>

            <div class="notes-list">
              <div v-for="note in patientNotes" :key="note.id" class="note-item">
                <div class="note-indicator"></div>
                <div class="note-content">
                  <div class="note-header-row">
                    <span class="note-date">{{ formatDate(note.date) }}</span>
                    <span class="note-type">{{ note.visitType }}</span>
                  </div>
                  <p class="note-text">{{ note.note }}</p>
                </div>
              </div>
              <div v-if="patientNotes.length === 0" class="no-notes">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <p>No visit notes yet.</p>
                <p class="no-notes-hint">Add a note to track patient visits</p>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <BaseCard>
        <div class="not-found-content">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2>Patient not found</h2>
          <p>The patient you're looking for doesn't exist.</p>
          <BaseButton variant="primary" @click="goBack">Go Back</BaseButton>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useNotesStore } from '@/stores/notes'
import { formatDate } from '@/utils/formatters'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const patientsStore = usePatientsStore()
const notesStore = useNotesStore()

const patientId = Number(route.params.id)
const patient = computed(() => patientsStore.getPatientById(patientId))
const patientNotes = computed(() => notesStore.getNotesByPatientId(patientId))

const showForm = ref(false)

const newNote = ref({
  date: new Date().toISOString().split('T')[0],
  visitType: '',
  note: ''
})

function handleSubmit() {
  notesStore.addNote({
    patientId: patientId,
    date: newNote.value.date,
    visitType: newNote.value.visitType,
    note: newNote.value.note
  })

  newNote.value = {
    date: new Date().toISOString().split('T')[0],
    visitType: '',
    note: ''
  }

  showForm.value = false
}

function goBack() {
  router.push('/patients')
}

onMounted(() => {
  notesStore.loadNotes()
})
</script>
<style scoped>
.patient-detail {
  height: 100%;
  overflow-y: auto;
  background-color: var(--color-background-secondary);
  padding: var(--spacing-8);
}

.page-header {
  margin-bottom: var(--spacing-6);
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: var(--spacing-6);
  align-items: start;
}

/* Patient Profile Section */
.patient-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.patient-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-5);
  padding-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
}

.patient-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.patient-info h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.medical-id {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--color-background-tertiary);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-family: var(--font-family-mono);
  width: fit-content;
}

.patient-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-4);
  padding-top: var(--spacing-6);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-background-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  border-radius: var(--radius-base);
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-1);
}

.stat-value {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

/* Notes Section */
.notes-section {
  position: sticky;
  top: var(--spacing-6);
}

.notes-card {
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.notes-header h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

/* Note Form */
.note-form {
  background: var(--color-background-tertiary);
  padding: var(--spacing-5);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-4);
  border: 1px solid var(--color-border);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-base);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  font-family: var(--font-family-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  margin-top: var(--spacing-4);
}

/* Notes List */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  overflow-y: auto;
  max-height: calc(100vh - 400px);
  padding-right: var(--spacing-2);
}

.note-item {
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: var(--color-background-tertiary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
}

.note-item:hover {
  border-color: var(--color-border-strong);
  background: var(--color-surface);
}

.note-indicator {
  width: 4px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500));
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.note-content {
  flex: 1;
  min-width: 0;
}

.note-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-2);
}

.note-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.note-type {
  font-size: var(--font-size-xs);
  color: var(--color-primary-600);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-1) var(--spacing-2);
  background: var(--color-primary-100);
  border-radius: var(--radius-sm);
}

.note-text {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

/* Empty State */
.no-notes {
  text-align: center;
  padding: var(--spacing-8) var(--spacing-4);
  color: var(--color-text-tertiary);
}

.no-notes svg {
  color: var(--color-text-disabled);
  margin-bottom: var(--spacing-4);
}

.no-notes p {
  margin: var(--spacing-2) 0;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.no-notes-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* Not Found State */
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.not-found-content {
  text-align: center;
  padding: var(--spacing-8);
}

.not-found-content svg {
  color: var(--color-text-disabled);
  margin-bottom: var(--spacing-4);
}

.not-found-content h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.not-found-content p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-6) 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .notes-section {
    position: static;
  }

  .notes-card {
    max-height: none;
  }

  .notes-list {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .patient-detail {
    padding: var(--spacing-6);
  }

  .patient-stats {
    grid-template-columns: 1fr;
  }

  .patient-header {
    flex-direction: column;
    text-align: center;
  }

  .medical-id {
    margin: 0 auto;
  }
}
</style>