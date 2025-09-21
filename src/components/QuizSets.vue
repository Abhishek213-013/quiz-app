<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
    <!-- Navbar -->
    <Navbar />

    <div class="flex items-start justify-center p-6 mt-12 w-full">
      <main class="flex-1 max-w-5xl">
        <h1 class="text-3xl md:text-4xl font-bold text-indigo-950 mb-6 drop-shadow-lg text-center">
          Select a Quiz Set
        </h1>

        <!-- No sets available -->
        <div v-if="quizSets.length === 0" class="text-red-400 text-lg text-center">
          No quiz sets available. Please contact admin.
        </div>

        <!-- Quiz set tiles -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="set in quizSets"
            :key="set.id"
            @click="startQuiz(set)"
            class="p-6 bg-gradient-to-r from-gray-200 to-gray-600 bg-opacity-20 backdrop-blur-md rounded-xl shadow cursor-pointer transform transition hover:scale-105 hover:shadow-2xl"
          >
            <h2 class="font-semibold text-lg text-black">{{ set.title }}</h2>
            <p class="text-gray-700 mt-2">{{ set.questions.length }} questions</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './Navbar.vue'

const router = useRouter()
const quizSets = reactive([])

onMounted(async () => {
  // Try loading from localStorage first
  const stored = JSON.parse(localStorage.getItem('quizSets'))
  if (stored && stored.length) {
    quizSets.push(...stored)
  } else {
    // Fallback to quizzes.json
    try {
      const res = await fetch('/data/quizzes.json')
      const data = await res.json()
      quizSets.push(...data)
      localStorage.setItem('quizSets', JSON.stringify(data)) // persist
    } catch (err) {
      console.error('Failed to load quizzes.json:', err)
    }
  }
})

function startQuiz(set) {
  router.push(`/quiz-page/${set.id}`)
}
</script>
