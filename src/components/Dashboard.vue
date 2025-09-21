<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
    <!-- Navbar -->
    <Navbar />

    <!-- Dashboard Content -->
    <div class="flex flex-col items-center justify-center p-6 mt-16 w-full max-w-5xl mx-auto">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-12 drop-shadow-lg text-center cursor-pointer"
        @click="$router.push('/')"
      >
        Quiz App Dashboard
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <!-- Take Quiz -->
        <div
          @click="$router.push('/quiz-sets')"
          class="bg-gradient-to-r from-gray-400 to-gray-600 bg-opacity-20 backdrop-blur-md text-cyan-900 font-semibold text-xl p-8 rounded-2xl cursor-pointer border border-black shadow-lg transform transition hover:scale-105 hover:bg-amber-400/20 hover:shadow-amber-400/50 flex items-center justify-center"
        >
          Take Quiz
        </div>

        <!-- Manage Quizzes -->
        <button
          @click="handleManageQuizzes"
          class="bg-gradient-to-r from-gray-400 to-gray-600 bg-opacity-20 backdrop-blur-md text-cyan-900 font-semibold text-xl p-8 rounded-2xl cursor-pointer border border-black shadow-lg transform transition hover:scale-105 hover:bg-amber-400/20 hover:shadow-amber-400/50 flex items-center justify-center"
        >
          Manage Quizzes
        </button>

        <!-- Previous Records -->
        <div
          @click="$router.push('/records')"
          class="bg-gradient-to-r from-gray-400 to-gray-600 bg-opacity-20 backdrop-blur-md text-cyan-900 font-semibold text-xl p-8 rounded-2xl cursor-pointer border border-black shadow-lg transform transition hover:scale-105 hover:bg-amber-400/20 hover:shadow-amber-400/50 flex items-center justify-center"
        >
          Previous Records
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue'
import { useRouter } from 'vue-router'
import { askSecretKey } from '../utils/adminKey'

const router = useRouter()

// Manage Quizzes flow
function handleManageQuizzes() {
  askSecretKey().then((valid) => {
    if (valid) {
      router.push('/manage-sets')
    }
  })
}
</script>
