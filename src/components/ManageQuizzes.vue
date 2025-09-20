<template>
  <div class="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500">
    <!-- Navbar -->
    <nav class="w-full bg-indigo-600 bg-opacity-20 backdrop-blur-md p-4 flex items-center shadow-md">
      <div class="flex items-center space-x-3">
        <!-- Logo -->
        <img :src="logo" alt="Logo" class="w-10 h-10 object-contain">
        <!-- Title -->
        <div @click="goDashboard" class="text-white text-2xl font-bold drop-shadow-lg cursor-pointer">
          MindSpark
        </div>
      </div>
    </nav>

    <div class="flex items-start">
      <!-- Sidebar -->
      <aside class="w-64 bg-gradient-to-r from-indigo-600 to-blue-500 bg-opacity-20 backdrop-blur-md shadow-md p-6 hidden md:flex flex-col space-y-5"
             style="padding-bottom: 2cm;">
        <router-link to="/" class="font-semibold text-black hover:text-indigo-200">Dashboard</router-link>
        <router-link to="/quiz" class="font-semibold text-black hover:text-indigo-200">Take Quiz</router-link>
        <router-link to="/manage" class="font-semibold text-black hover:text-indigo-200">Manage Quizzes</router-link>
        <router-link to="/records" class="font-semibold text-black hover:text-indigo-200">Previous Records</router-link>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <h1 class="text-3xl md:text-4xl font-bold text-indigo-950 mb-6 drop-shadow-lg">Manage Quizzes</h1>

        <button @click="addQuiz"
                class="mb-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow font-semibold transform hover:scale-105 transition">
          Add New Quiz
        </button>

        <div v-if="quizzes.length === 0" class="text-red-300 text-lg">
          No quizzes available.
        </div>

        <transition-group name="card" tag="div">
          <div v-for="(quiz, index) in quizzes" :key="quiz.id"
               class="p-6 bg-gradient-to-r from-indigo-700 to-purple-800 bg-opacity-20 backdrop-blur-md rounded-xl shadow mb-4 transition transform hover:scale-105 hover:shadow-2xl hover:from-indigo-500 hover:to-purple-500 cursor-pointer">
            <div class="flex justify-between items-center">
              <p class="font-semibold text-white text-lg">{{ index + 1 }}. {{ quiz.question }}</p>
              <div class="space-x-2">
                <button @click="editQuiz(index)"
                        class="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded font-medium transform hover:scale-105 transition">
                  Edit
                </button>
                <button @click="deleteQuiz(index)"
                        class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded font-medium text-white transform hover:scale-105 transition">
                  Delete
                </button>
              </div>
            </div>
            <ul class="mt-2 list-disc list-inside text-white">
              <li v-for="(opt, i) in quiz.options" :key="i">
                {{ i + 1 }}. {{ opt }} <span v-if="i === quiz.answer" class="font-bold text-green-400">(Answer)</span>
              </li>
            </ul>
          </div>
        </transition-group>
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import logo from '../assets/logo.png'
import quizzesData from '../assets/quizzes.json'  // ✅ Import default quizzes

const quizzes = reactive([])

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('quizzes'))
  if (stored && stored.length > 0) {
    quizzes.push(...stored)
  } else {
    quizzes.push(...quizzesData)  // ✅ Use quizzes.json if no local quizzes exist
    saveQuizzes()                // ✅ Save them to localStorage so they persist
  }
})

function saveQuizzes() {
  localStorage.setItem('quizzes', JSON.stringify(quizzes))
}

function addQuiz() {
  const question = prompt("Enter question:")
  if (!question) return
  const optionsStr = prompt("Enter options (comma separated):")
  if (!optionsStr) return
  const options = optionsStr.split(',').map(o => o.trim())
  const answerIndex = parseInt(prompt(`Enter correct option index (0-${options.length - 1}):`))
  if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= options.length) return alert("Invalid answer index!")
  
  quizzes.push({ id: Date.now(), question, options, answer: answerIndex })
  saveQuizzes()
}

function editQuiz(index) {
  const quiz = quizzes[index]
  const question = prompt("Edit question:", quiz.question)
  if (!question) return
  const optionsStr = prompt("Edit options:", quiz.options.join(','))
  if (!optionsStr) return
  const options = optionsStr.split(',').map(o => o.trim())
  const answerIndex = parseInt(prompt(`Edit correct option index (0-${options.length - 1}):`, quiz.answer))
  if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= options.length) return alert("Invalid answer index!")
  
  quiz.question = question
  quiz.options = options
  quiz.answer = answerIndex
  saveQuizzes()
}

function deleteQuiz(index) {
  if (confirm("Are you sure?")) {
    quizzes.splice(index, 1)
    saveQuizzes()
  }
}

function goDashboard() {
  router.push('/')
}
</script>


<style>
/* Card slide animation */
.card-enter-active {
  transition: all 0.5s ease;
}
.card-leave-active {
  transition: all 0.3s ease;
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.card-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
