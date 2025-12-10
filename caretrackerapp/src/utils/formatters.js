/**
 * Format a date string to a human-readable format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "Monday, January 1, 2025")
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format hour in 24-hour format to 12-hour format with AM/PM
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Formatted hour (e.g., "2 PM", "9 AM")
 */
export function formatHour(hour) {
  if (hour === 12) return '12 PM'
  if (hour > 12) return `${hour - 12} PM`
  return `${hour} AM`
}
