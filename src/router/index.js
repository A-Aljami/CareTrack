import { createRouter , createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import PatientDetailView from "@/views/PatientDetailView.vue";
import PatientsView from "@/views/PatientsView.vue";
import NewAppointmentView from "@/views/NewAppointmentView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter ({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
      {
      path: '/patients',
      name: 'patients',
      component: PatientsView,
      meta: { requiresAuth: true }
    },
      {
      path: '/patients/:id',
      name: 'patient-detail',
      component: PatientDetailView,
      meta: { requiresAuth: true }
    },
      {
      path: '/appointments/new',
      name: 'new-appointment',
      component: NewAppointmentView,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && authStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
