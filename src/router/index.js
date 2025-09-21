import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import QuizPage from '../components/QuizPage.vue'
import ManageQuizzes from '../components/ManageQuizzes.vue'
import PreviousRecords from '../components/PreviousRecords.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/quiz', component: QuizPage },
  { 
    path: '/manage', 
    component: ManageQuizzes,
    meta: { requiresAdmin: true }  // mark as protected
  },
  { path: '/records', component: PreviousRecords }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (!isAdmin) {
      const key = prompt("Enter Admin Key:")
      if (key === "abhishek_30" || key === "Abhishek_30") {
        sessionStorage.setItem('isAdmin', 'true')
        next()
      } else {
        alert("Incorrect key!")
        next(false) // cancel navigation
      }
    } else {
      next()
    }
  } else {
    // Clear admin session when leaving /manage
    if (from.path === '/manage') sessionStorage.removeItem('isAdmin')
    next()
  }
})

export default router
