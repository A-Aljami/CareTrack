export const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    medicalId: 'MED001'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    medicalId: 'MED002'
  },
  {
    id: '3',
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    medicalId: 'MED003'
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 27,
    gender: 'Female',
    medicalId: 'MED004'
  }
]

export const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '09:00',
    reason: 'Annual Checkup',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Sarah Johnson',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '10:30',
    reason: 'Follow-up Visit',
    status: 'checked-in'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Michael Brown',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '14:00',
    reason: 'Lab Result Review',
    status: 'completed'
  },
  {
    id: '4',
    patientId: '4',
    patientName: 'Emily Davis',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: '15:30',
    reason: 'Consultation',
    status: 'scheduled'
  }
]