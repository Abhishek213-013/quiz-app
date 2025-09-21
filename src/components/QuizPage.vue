<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
    <!-- Navbar -->
    <Navbar />

    <div class="flex items-start">
      <!-- Sidebar -->
      <aside
        class="w-64 bg-gradient-to-r from-gray-100 to-gray-200 bg-opacity-20 backdrop-blur-md shadow-md p-6 hidden md:flex flex-col space-y-8"
      >
        <router-link to="/" class="font-semibold text-black hover:text-gray-500">Dashboard</router-link>
        <router-link to="/quiz" class="font-semibold text-black hover:text-gray-500">Take Quiz</router-link>
        <a @click.prevent="askSecretKey" class="font-semibold text-black hover:text-gray-500 cursor-pointer">Manage Quizzes</a>
        <router-link to="/records" class="font-semibold text-black hover:text-gray-500">Previous Records</router-link>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <h1 class="text-3xl md:text-4xl font-bold text-indigo-950 mb-8 drop-shadow-lg">Take Quiz</h1>

        <div v-if="quizList.length === 0" class="text-red-300 text-lg">
          No quizzes available. Please contact admin.
        </div>

        <form v-else @submit.prevent="submitQuiz" class="w-full max-w-3xl space-y-6">
          <transition-group name="slide-fade" tag="div">
            <div
              v-for="(quiz, index) in quizList"
              :key="index"
              class="p-6 bg-gradient-to-r from-gray-200 to-gray-600 bg-opacity-20 backdrop-blur-md rounded-xl shadow transition transform hover:scale-105 hover:shadow-2xl hover:from-gray-500 hover:to-gray-700 cursor-pointer"
            >
              <p class="font-semibold text-black text-lg">{{ index + 1 }}. {{ quiz.question }}</p>
              <div class="mt-3 space-y-2">
                <label
                  v-for="(option, i) in quiz.options"
                  :key="i"
                  class="flex items-center space-x-3 cursor-pointer text-black"
                >
                  <input
                    type="radio"
                    :name="'question' + index"
                    :value="option"
                    v-model="answers[index]"
                    required
                    class="w-5 h-5 accent-indigo-500"
                  />
                  <span>{{ option }}</span>
                </label>
              </div>
            </div>
          </transition-group>

          <button
            type="submit"
            class="w-full bg-gray-500 hover:bg-black text-white py-3 rounded-xl text-lg font-semibold shadow"
          >
            Submit Quiz
          </button>
        </form>

        <!-- Result Modal -->
        <transition name="fade">
          <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-8 max-w-sm text-center shadow-2xl transform transition-all scale-95 animate-modal">
              <h2 class="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p class="text-lg mb-2">Name: <span class="font-semibold">{{ participantName }}</span></p>
              <p class="text-lg mb-6">Score: <span class="font-semibold">{{ score }} / {{ total }}</span></p>
              <button
                @click="closeModal"
                class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './Navbar.vue'
import quizzesData from '../assets/quizzes.json'
import { askSecretKey } from '../utils/adminKey'

const router = useRouter()

// Make quizzes reactive
const quizList = reactive([...quizzesData])
const answers = reactive({})
const showModal = ref(false)
const participantName = ref('')
const score = ref(0)
const total = ref(0)

function submitQuiz() {
  let tempScore = 0
  quizList.forEach((q, i) => {
    if (answers[i] === q.answer) tempScore++
  })

  const name = prompt('Enter your name:')
  if (!name) return alert('Name is required!')

  participantName.value = name
  score.value = tempScore
  total.value = quizList.length

  // Optional: store results locally
  const storedResults = JSON.parse(localStorage.getItem('quizResults')) || []
  storedResults.push({
    name,
    date: new Date().toISOString().split('T')[0],
    score: tempScore,
    total: quizList.length
  })
  localStorage.setItem('quizResults', JSON.stringify(storedResults))

  showModal.value = true
}

function closeModal() {
  showModal.value = false
  router.push('/')
}

function goDashboard() {
  router.push('/')
}
</script>

<style>
/* Fade transition for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Card slide-fade animation */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Modal pop animation */
@keyframes modal-pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-modal {
  animation: modal-pop 0.4s ease-out forwards;
}
</style>
