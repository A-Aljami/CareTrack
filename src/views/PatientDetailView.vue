<template>
  <div class="patient-detail">
    <div v-if="patient" class="content-wrapper">
      <div class="patient-card">
        <div class="patient-avatar">
          {{ patient.name.charAt(0) }}
        </div>
        <h1>{{ patient.name }}</h1>
        <div class="patient-details">
          <div class="detail-item">
            <span class="label">Age:</span>
            <span class="value">{{ patient.age }} years</span>
          </div>
          <div class="detail-item">
            <span class="label">Gender:</span>
            <span class="value">{{ patient.gender }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Medical ID:</span>
            <span class="value">{{ patient.medicalId }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <div class="sidebar-header">
          <h2>Visit Notes</h2>
          <button class="add-note-btn" @click="showForm = !showForm">+</button>
        </div>

        <form v-if="showForm" @submit.prevent="handleSubmit" class="note-form">
          <div class="form-group">
            <label>Date:</label>
            <input v-model="newNote.date" type="date" required />
          </div>

          <div class="form-group">
            <label>Visit Type:</label>
            <select v-model="newNote.visitType" required>
              <option value="">Select type...</option>
              <option value="Checkup">Checkup</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Lab Result Review">Lab Result Review</option>
            </select>
          </div>

          <div class="form-group">
            <label>Note:</label>
            <textarea v-model="newNote.note" rows="3" required></textarea>
          </div>

          <BaseButton type="submit" variant="success" full-width>Add Note</BaseButton>
        </form>

        <div class="notes-list">
          <BaseCard v-for="note in patientNotes" :key="note.id" class="note-card">
            <div class="note-header">
              <span class="note-date">{{ formatDate(note.date) }}</span>
              <span class="note-type">{{ note.visitType }}</span>
            </div>
            <p class="note-text">{{ note.note }}</p>
          </BaseCard>
          <p v-if="patientNotes.length === 0" class="no-notes">No visit notes yet.</p>
        </div>
      </div>
    </div>

    <div v-else>
      <p>Patient not found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePatientsStore } from '@/stores/patients'
import { useNotesStore } from '@/stores/notes'
import { formatDate } from '@/utils/formatters'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'

const route = useRoute()
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

onMounted(() => {
  notesStore.loadNotes()
})
</script>
<style scoped>
.patient-detail {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.patient-card {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  margin: 0 auto;
  max-width: 600px;
}

.patient-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
}

.patient-card h1 {
  margin: 0 0 2.5rem 0;
  color: #333;
  font-size: 2.2rem;
}

.patient-details {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item .label {
  font-size: 0.85rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item .value {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
}

.sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  height: fit-content;
  position: sticky;
  top: 90px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.sidebar-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.add-note-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  padding: 0;
}

.add-note-btn:hover {
  background: #45a049;
}

.note-form {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: #333;
  font-size: 0.85rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #eee;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

.note-card {
  border-left: 4px solid #4CAF50;
}

.note-header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.8rem;
}

.note-date {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.note-type {
  font-size: 0.75rem;
  color: #4CAF50;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.note-text {
  margin: 0;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
}

.no-notes {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 1rem;
}
</style>