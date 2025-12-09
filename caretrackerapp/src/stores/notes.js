import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])

  function loadNotes() {
    const saved = localStorage.getItem('patientNotes')
    if (saved) {
      notes.value = JSON.parse(saved)
    }
  }

  function saveNotes() {
    localStorage.setItem('patientNotes', JSON.stringify(notes.value))
  }

  function getNotesByPatientId(patientId) {
    return notes.value.filter(note => note.patientId === patientId)
  }

  function addNote(note) {
    const newNote = {
      id: Date.now(),
      ...note,
      createdAt: new Date().toISOString()
    }
    notes.value.push(newNote)
    saveNotes()
  }

  return {
    notes,
    loadNotes,
    getNotesByPatientId,
    addNote
  }
})