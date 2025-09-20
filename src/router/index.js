import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import QuizPage from '../components/QuizPage.vue'
import ManageQuizzes from '../components/ManageQuizzes.vue'
import PreviousRecords from '../components/PreviousRecords.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/quiz', component: QuizPage },
  { path: '/manage', component: ManageQuizzes },
  { path: '/records', component: PreviousRecords }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
