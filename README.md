# CareTrack

A modern, single-page healthcare management application built with Vue 3 for clinic receptionists to manage appointments, patients, and visit notes efficiently.

## Overview

CareTrack is a comprehensive healthcare task management system designed for small clinic receptionists. The application provides an intuitive interface to view today's appointments, manage patient records, and maintain detailed visit notes.

## Features

### Core Functionality

- **Mock Authentication** - Simple login system with route protection
- **Dashboard** - Weekly calendar view with appointment management
  - Real-time status updates (Scheduled, Checked-In, Completed)
  - Appointment filtering and navigation
  - Summary statistics
- **Patient Management** - Complete patient directory with search
  - Search by name or medical ID
  - Detailed patient profiles
- **Visit Notes** - Persistent note-taking system
  - Add notes with date, visit type, and details
  - LocalStorage persistence
- **New Appointments** - Form-based appointment creation
  - Patient selection
  - Date/time validation (no past dates)
  - Required field validation

### Technical Features

- **Async Data Loading** - Simulated API calls with loading indicators
- **Error Handling** - Graceful error states with retry functionality
- **Responsive Design** - Clean, modern UI optimized for desktop
- **State Management** - Centralized Pinia stores
- **Route Protection** - Authentication-based access control

## Technologies Used

### Frontend Framework
- **Vue 3** (v3.5.25) - Progressive JavaScript framework
- **Composition API** - Modern Vue development approach
- **Vue Router** (v4.6.3) - Client-side routing

### State Management
- **Pinia** (v3.0.4) - Official Vue state management

### Build Tools
- **Vite** (v7.2.4) - Next-generation frontend tooling
- **Node.js** (v20.19.0 or v22.12.0+) - JavaScript runtime

### Code Quality
- **ESLint** (v9.39.1) - Code linting
- **Prettier** (v3.6.2) - Code formatting

## Project Structure

```
caretrackerapp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BaseButton.vue
│   │   ├── BaseCard.vue
│   │   ├── StatusBadge.vue
│   │   ├── LoadingSpinner.vue
│   │   └── NavHeader.vue
│   ├── views/               # Page components
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── PatientsView.vue
│   │   ├── PatientDetailView.vue
│   │   └── NewAppointmentView.vue
│   ├── stores/              # Pinia state stores
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── patients.js
│   │   └── notes.js
│   ├── services/            # API simulation layer
│   │   └── api.js
│   ├── data/                # Mock data
│   │   └── mockData.js
│   ├── router/              # Route configuration
│   │   └── index.js
│   └── App.vue              # Root component
├── package.json
└── vite.config.js
```

## Installation & Setup

### Prerequisites

- Node.js v20.19.0 or v22.12.0+
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CareTrack/caretrackerapp
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Code Linting

```bash
npm run lint
```

## Usage

### Login
1. Navigate to the login page
2. Enter any email and password (both fields required)
3. Click "Login" to access the dashboard

### Managing Appointments
1. View the weekly calendar on the dashboard
2. Click on appointments to view details
3. Update appointment status (Scheduled → Checked-In → Completed)
4. Use filters to view specific appointment types
5. Navigate between weeks using arrow buttons

### Managing Patients
1. Navigate to the Patients page
2. Search for patients by name or medical ID
3. Click on a patient to view their details

### Adding Visit Notes
1. Open a patient's detail page
2. Click the "+" button to add a new note
3. Enter date, visit type, and note details
4. Notes are automatically saved to localStorage

### Creating Appointments
1. Navigate to "New Appointment"
2. Select a patient from the dropdown
3. Choose date and time (must be in the future)
4. Enter appointment reason
5. Submit to create the appointment

## Development Notes

### Simulated API
The application uses a mock API layer that:
- Simulates network delays (800ms - 2000ms)
- Randomly fails 20% of the time to demonstrate error handling
- Returns hardcoded patient and appointment data

### Error Handling
All data fetching includes:
- Loading states with visual indicators
- Error states with clear messaging
- Retry functionality for failed requests

### Data Persistence
- Visit notes are stored in browser localStorage
- Appointments and patients are loaded from mock data on each session

## Future Improvements

Given more time, the following enhancements would be valuable:

### User Experience
- **Dark Mode** - Theme toggle with localStorage preference
- **Mobile Responsive Design** - Optimize for tablets and smartphones
- **Advanced Search** - Filter appointments by date range, patient, or status
- **Appointment Reminders** - Browser notifications for upcoming appointments
- **Drag & Drop Calendar** - Reschedule appointments by dragging

### Technical Enhancements
- **Real Backend Integration** - Connect to actual REST API or GraphQL
- **Form Validation Library** - Implement VeeValidate or similar
- **Unit & E2E Testing** - Comprehensive test coverage with Vitest and Cypress
- **TypeScript** - Add type safety throughout the application
- **Accessibility (A11y)** - WCAG 2.1 compliance, keyboard navigation
- **Internationalization (i18n)** - Multi-language support

### Features
- **Patient History Timeline** - Visual representation of all visits
- **Appointment Conflicts** - Prevent double-booking
- **Export Functionality** - Export patient data and reports
- **User Roles** - Different permissions for doctors, nurses, receptionists
- **Analytics Dashboard** - Charts and insights on clinic operations
- **Email/SMS Notifications** - Automated appointment reminders

### Performance
- **Virtual Scrolling** - Handle large patient lists efficiently
- **Image Optimization** - Lazy loading and compression
- **Code Splitting** - Route-based code splitting for faster initial load
- **PWA Support** - Offline functionality with service workers

## Browser Support

Tested and optimized for:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Vue Official Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## License

This project is developed as a learning exercise and demo application.

## Contact

For questions or feedback, please open an issue in the repository.
