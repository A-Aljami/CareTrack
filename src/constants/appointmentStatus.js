/**
 * Appointment status constants
 * Used throughout the application for consistent status handling
 */
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CHECKED_IN: 'checked-in',
  COMPLETED: 'completed'
}

/**
 * Status labels for display
 */
export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.SCHEDULED]: 'Scheduled',
  [APPOINTMENT_STATUS.CHECKED_IN]: 'Checked In',
  [APPOINTMENT_STATUS.COMPLETED]: 'Completed'
}

/**
 * All available appointment statuses
 */
export const APPOINTMENT_STATUSES = Object.values(APPOINTMENT_STATUS)
