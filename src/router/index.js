// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import QuizSets from '../components/QuizSets.vue'
import QuizPage from '../components/QuizPage.vue'
import ManageQuizzes from '../components/ManageQuizzes.vue'
import PreviousRecords from '../components/PreviousRecords.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/quiz-sets', component: QuizSets },
  { path: '/quiz-page/:setId', component: QuizPage, props: true }, // <-- dynamic route
  { path: '/manage', component: ManageQuizzes, meta: { requiresAdmin: true } },
  { path: '/records', component: PreviousRecords }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global admin guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (!isAdmin) {
      const key = prompt("Enter Admin Key:")
      if (key === "admin123" || key === "Admin123") {
        sessionStorage.setItem('isAdmin', 'true')
        next()
      } else {
        alert("Incorrect key!")
        next(false)
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
