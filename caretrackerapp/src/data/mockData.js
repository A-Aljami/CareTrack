export const mockPatients = [
  {
    id: 1,
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    medicalId: 'MED001'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    medicalId: 'MED002'
  },
  {
    id: 3,
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    medicalId: 'MED003'
  },
  {
    id: 4,
    name: 'Emily Davis',
    age: 28,
    gender: 'Female',
    medicalId: 'MED004'
  },
  {
    id: 5,
    name: 'David Wilson',
    age: 51,
    gender: 'Male',
    medicalId: 'MED005'
  },
  {
    id: 6,
    name: 'Lisa Martinez',
    age: 39,
    gender: 'Female',
    medicalId: 'MED006'
  },
  {
    id: 7,
    name: 'James Taylor',
    age: 62,
    gender: 'Male',
    medicalId: 'MED007'
  },
  {
    id: 8,
    name: 'Maria Garcia',
    age: 41,
    gender: 'Female',
    medicalId: 'MED008'
  },
  {
    id: 9,
    name: 'Robert Anderson',
    age: 55,
    gender: 'Male',
    medicalId: 'MED009'
  }
]

// Helper function to get date offsets
const getDate = (daysOffset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  return date.toISOString().split('T')[0]
}

export const mockAppointments = [
  // TODAY'S APPOINTMENTS
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    date: getDate(0), // Today
    time: '09:00',
    reason: 'Annual Checkup',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Johnson',
    date: getDate(0), // Today
    time: '10:30',
    reason: 'Follow-up Visit',
    status: 'checked-in'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    date: getDate(0), // Today
    time: '14:00',
    reason: 'Lab Result Review',
    status: 'completed'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Emily Davis',
    date: getDate(0), // Today
    time: '15:30',
    reason: 'Consultation',
    status: 'scheduled'
  },

  // THIS WEEK'S APPOINTMENTS (not today)
  {
    id: '5',
    patientId: '5',
    patientName: 'David Wilson',
    date: getDate(2), // 2 days from now
    time: '11:00',
    reason: 'Physical Examination',
    status: 'scheduled'
  },
  {
    id: '6',
    patientId: '6',
    patientName: 'Lisa Martinez',
    date: getDate(3), // 3 days from now
    time: '13:30',
    reason: 'Prescription Renewal',
    status: 'scheduled'
  },
  {
    id: '7',
    patientId: '7',
    patientName: 'James Taylor',
    date: getDate(-2), // 2 days ago
    time: '10:00',
    reason: 'Blood Pressure Check',
    status: 'completed'
  },

  // THIS MONTH'S APPOINTMENTS (not this week)
  {
    id: '8',
    patientId: '8',
    patientName: 'Maria Garcia',
    date: getDate(10), // 10 days from now
    time: '14:30',
    reason: 'Vaccination',
    status: 'scheduled'
  },
  {
    id: '9',
    patientId: '9',
    patientName: 'Robert Anderson',
    date: getDate(15), // 15 days from now
    time: '09:30',
    reason: 'Diabetes Management',
    status: 'scheduled'
  },
  {
    id: '10',
    patientId: '1',
    patientName: 'John Smith',
    date: getDate(-10), // 10 days ago
    time: '11:30',
    reason: 'Eye Exam',
    status: 'completed'
  },

  // OLDER APPOINTMENTS (previous months)
  {
    id: '11',
    patientId: '2',
    patientName: 'Sarah Johnson',
    date: getDate(-40), // ~1.5 months ago
    time: '10:00',
    reason: 'General Checkup',
    status: 'completed'
  },
  {
    id: '12',
    patientId: '3',
    patientName: 'Michael Brown',
    date: getDate(-60), // ~2 months ago
    time: '15:00',
    reason: 'Flu Shot',
    status: 'completed'
  }
]