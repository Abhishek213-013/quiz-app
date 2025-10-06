<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
    <Navbar />

    <!-- Mobile Sidebar Toggle -->
    <button
      class="md:hidden fixed top-4 left-4 z-50 bg-gray-200 p-2 rounded-lg shadow hover:bg-gray-300"
      @click="mobileSidebarOpen = !mobileSidebarOpen"
    >
      ⇶
    </button>

    <div class="flex items-start">
      <!-- Sidebar (Desktop) -->
      <aside class="w-64 bg-gradient-to-r from-gray-100 to-gray-200 bg-opacity-20 backdrop-blur-md shadow-md p-6 hidden md:flex flex-col space-y-8">
        <router-link to="/" class="font-semibold text-black hover:text-gray-500">Dashboard</router-link>
        <router-link to="/quiz-sets" class="font-semibold text-black hover:text-gray-500">Take Quiz</router-link>
        <a @click.prevent="askSecretKey" class="font-semibold text-black hover:text-gray-500 cursor-pointer">Manage Quizzes</a>
        <router-link to="/records" class="font-semibold text-black hover:text-gray-500">Previous Records</router-link>
      </aside>

      <!-- Sidebar (Mobile) -->
      <transition name="slide">
        <aside
          v-if="mobileSidebarOpen"
          class="fixed inset-y-0 left-0 w-64 bg-gradient-to-r from-gray-100 to-gray-200 p-6 shadow-lg flex flex-col space-y-6 z-40"
        >
          <button class="self-end text-gray-700 font-bold text-lg" @click="mobileSidebarOpen = false">✕</button>
          <router-link @click="mobileSidebarOpen = false" to="/" class="font-semibold text-black hover:text-gray-500">Dashboard</router-link>
          <router-link @click="mobileSidebarOpen = false" to="/quiz-sets" class="font-semibold text-black hover:text-gray-500">Take Quiz</router-link>
          <a @click.prevent="() => { askSecretKey(); mobileSidebarOpen = false }" class="font-semibold text-black hover:text-gray-500 cursor-pointer">Manage Quizzes</a>
          <router-link @click="mobileSidebarOpen = false" to="/records" class="font-semibold text-black hover:text-gray-500">Previous Records</router-link>
        </aside>
      </transition>

      <main class="flex-1 p-6">
        <h1 class="text-3xl md:text-4xl font-bold text-indigo-950 mb-4 drop-shadow-lg">
          Quiz: {{ currentSet.name }}
        </h1>

        <!-- Timer -->
        <div
          v-if="quizList.length"
          class="fixed top-4 right-4 z-50 px-4 py-2 bg-red-100 text-lg font-semibold rounded shadow"
          :class="timeLeft <= 10 ? 'text-red-700 animate-pulse bg-red-200' : 'text-red-600 bg-red-100'"
        >
          Time Left: {{ timeLeft }}s
        </div>

        <!-- No quiz -->
        <div v-if="!quizList.length" class="text-red-300 text-lg">No questions available for this set.</div>

        <!-- Quiz Questions -->
        <form v-else @submit.prevent="submitQuiz(false)" class="w-full max-w-3xl space-y-6">
          <div
            v-for="(quiz, index) in quizList"
            :key="index"
            class="p-6 bg-gradient-to-r from-gray-200 to-gray-600 bg-opacity-20 backdrop-blur-md rounded-xl shadow"
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
                  :name="'question'+index"
                  :value="i"
                  v-model.number="answers[index]"   
                  class="w-5 h-5 accent-indigo-500"
                />
                <span>{{ option }}</span>
              </label>
            </div>
          </div>
          <button
            :disabled="nameModalOpen || resultModalOpen"
            type="submit"
            class="w-full bg-gray-500 hover:bg-black text-white py-3 rounded-xl text-lg font-semibold shadow disabled:opacity-60"
          >
            Submit Quiz
          </button>
        </form>

        <!-- Name Modal -->
        <div
          v-if="nameModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div class="bg-white rounded-2xl p-6 w-11/12 max-w-sm">
            <h3 class="text-lg font-bold mb-3">Enter your name</h3>
            <input v-model="participantName" type="text" placeholder="Your name" class="w-full p-3 border rounded mb-4"/>
            <div class="flex gap-3">
              <button @click="saveNameAndShowResult" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Save</button>
              <button @click="saveAnonymousAndShowResult" class="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">Save as Anonymous</button>
            </div>
          </div>
        </div>

        <!-- Result Modal -->
        <transition name="fade">
          <div v-if="resultModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl p-8 max-w-sm text-center shadow-2xl transform transition-all scale-95 animate-modal">
              <h2 class="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <p class="text-lg mb-2">Name: <span class="font-semibold">{{ participantName }}</span></p>
              <p class="text-lg mb-2">Score: <span class="font-semibold">{{ score }} / {{ total }}</span></p>
              <p class="text-lg text-gray-600 mb-6">Skipped: <span class="font-semibold">{{ skipped }}</span></p>
              <button @click="closeResultModal" class="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow">Back to Dashboard</button>
            </div>
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navbar from './Navbar.vue'
import quizzesData from '../assets/quizzes.json'

const router = useRouter()
const route = useRoute()
const setId = parseInt(route.params.setId)
const storedSets = JSON.parse(localStorage.getItem('quizSets')) || quizzesData
const currentSet = storedSets.find(s => s.id === setId) || { name: 'Unknown Set', questions: [] }
currentSet.questions = currentSet.questions.map(q => ({ ...q, answer: q.answer ?? '' }))

const quizList = reactive([...currentSet.questions])
const answers = reactive({})
const total = ref(quizList.length)
const score = ref(0)
const skipped = ref(0)

const participantName = ref('')
const nameModalOpen = ref(false)
const resultModalOpen = ref(false)
const mobileSidebarOpen = ref(false)

const timeLeft = ref(60)
let timerInterval = null

onMounted(() => {
  if (quizList.length) startTimer()
})
onBeforeUnmount(() => clearInterval(timerInterval))

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else {
      clearInterval(timerInterval)
      computeScoreAndSkipped()
      participantName.value = 'Anonymous'
      nameModalOpen.value = true
    }
  }, 1000)
}

const answers = ref([]) // ✅ make it an array

function computeScoreAndSkipped() {
  let tempScore = 0
  let tempSkipped = 0

  quizList.forEach((q, i) => {
    const ansIndex = answers[i]

    if (ansIndex === undefined) {
      tempSkipped++
      return
    }

    const selectedOption = q.options?.[ansIndex]?.trim().toLowerCase()
    const correctAnswer = String(q.answer).trim().toLowerCase()

    // Handles both text or index based answers
    if (
      selectedOption === correctAnswer || 
      ansIndex === Number(q.answer)
    ) {
      tempScore++
    }
  })

  score.value = tempScore
  skipped.value = tempSkipped
}




function submitQuiz(auto = false) {
  clearInterval(timerInterval)
  computeScoreAndSkipped()
  if (!auto) participantName.value = ''
  nameModalOpen.value = true
}

function saveNameAndShowResult() {
  participantName.value = participantName.value.trim() || 'Anonymous'
  persistResultAndShow()
}

function saveAnonymousAndShowResult() {
  participantName.value = 'Anonymous'
  persistResultAndShow()
}

function persistResultAndShow() {
  const storedResults = JSON.parse(localStorage.getItem('quizResults')) || []
  storedResults.push({
    name: participantName.value,
    date: new Date().toISOString().split('T')[0],
    score: score.value,
    total: total.value,
    skipped: skipped.value,
    setId: currentSet.id
  })
  localStorage.setItem('quizResults', JSON.stringify(storedResults))
  nameModalOpen.value = false
  resultModalOpen.value = true
}

function closeResultModal() {
  resultModalOpen.value = false
  router.push('/')
}
</script>

<style scoped>
/* Simple slide-in animation for sidebar */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
