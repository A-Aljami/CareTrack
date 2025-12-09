import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])

  function loadNotesFromLocalStorage() {
    const saved = localStorage.getItem('visitNotes')
    if (saved) {
      notes.value = JSON.parse(saved)
    }
  }

  function saveNotesToLocalStorage() {
    localStorage.setItem('visitNotes', JSON.stringify(notes.value))
  }

  function addNote(note) {
    notes.value.push(note)
    saveNotesToLocalStorage()
  }

  function getNotesByPatientId(patientId) {
    return notes.value.filter(note => note.patientId === patientId)
  }

  return {
    notes,
    loadNotesFromLocalStorage,
    addNote,
    getNotesByPatientId
  }
})