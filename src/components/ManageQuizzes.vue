<template>
  <div class="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
    <Navbar />

    <div class="flex flex-col items-center p-6">
      <h1 class="text-3xl md:text-4xl font-bold text-indigo-950 mb-6 drop-shadow-lg text-center">
        Manage Quiz Sets
      </h1>

      <!-- Add New Set Button -->
      <button
        @click="openAddSetModal"
        class="mb-6 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl shadow font-semibold transform hover:scale-105 transition"
      >
        Add New Set
      </button>

      <!-- Quiz Sets Tiles -->
      <div v-if="quizSets.length === 0" class="text-red-400 text-lg text-center mb-6">
        No quiz sets available. Please add a new set.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <div
          v-for="set in quizSets"
          :key="set.id"
          @click="openEditSetModal(set)"
          class="p-6 bg-gradient-to-r from-gray-200 to-gray-600 bg-opacity-20 backdrop-blur-md rounded-xl shadow cursor-pointer transform transition hover:scale-105 hover:shadow-2xl"
        >
          <h2 class="font-semibold text-lg text-black">{{ set.title }}</h2>
          <p class="text-gray-700 mt-2">{{ set.questions.length }} questions</p>
        </div>
      </div>
    </div>

    <!-- Modal for Add/Edit Quiz Set -->
    <div
      v-if="modalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 class="text-xl font-bold mb-4">{{ editingSet ? 'Edit Set' : 'Add New Set' }}</h2>

        <!-- Set Title -->
        <input
          v-model="currentSet.title"
          type="text"
          placeholder="Set Title"
          class="w-full p-3 border rounded mb-4"
        />

        <!-- Questions -->
        <div v-for="(q, qIndex) in currentSet.questions" :key="q.id" class="mb-4 p-4 border rounded">
          <div class="flex items-center gap-2 mb-2">
            <input
              v-model="q.question"
              type="text"
              placeholder="Question text"
              class="flex-1 p-2 border rounded"
            />
            <button @click="removeQuestion(qIndex)" class="text-red-600 font-bold">✕</button>
          </div>

          <!-- Options -->
          <div v-for="(opt, optIndex) in q.options" :key="optIndex" class="flex items-center gap-2 mb-1">
            <input
              v-model="q.options[optIndex]"
              type="text"
              placeholder="Option text"
              class="flex-1 p-2 border rounded"
            />
            <button @click="removeOption(qIndex, optIndex)" class="text-red-500 font-bold">✕</button>
          </div>

          <button
            @click="addOption(qIndex)"
            class="mt-1 text-green-600 font-bold px-2 py-1 border rounded hover:bg-green-100"
          >
            + Option
          </button>

          <div class="mt-2">
            Correct Answer:
            <select v-model="q.answer" class="border p-1 rounded">
              <option v-for="(opt, i) in q.options" :key="i" :value="i">{{ i + 1 }}. {{ opt }}</option>
            </select>
          </div>
        </div>

        <!-- Add Question -->
        <button
          @click="addQuestion"
          class="mb-4 mt-2 text-indigo-600 font-bold px-3 py-1 border rounded hover:bg-indigo-100"
        >
          + Add Question
        </button>

        <!-- Modal Actions -->
        <div class="flex justify-end gap-3 mt-4">
          <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button @click="saveSet" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import Navbar from './Navbar.vue'
import quizzesData from '../assets/quizzes.json'

const quizSets = reactive([])
const modalOpen = ref(false)
const editingSet = ref(false)
const currentSet = reactive({ id: null, title: '', questions: [] })

// Load sets from localStorage or quizzes.json
onMounted(() => {
  const stored = JSON.parse(localStorage.getItem('quizSets')) || []

  if (stored.length > 0) {
    quizSets.push(...stored)
  } else {
    // Load default quizzes from quizzes.json
    quizzesData.forEach(set => {
      quizSets.push({
        id: set.id || Date.now() + Math.random(),
        title: set.title,
        questions: set.questions.map(q => ({
          id: q.id || Date.now() + Math.random(),
          question: q.question,
          options: [...q.options],
          answer: q.answer
        }))
      })
    })
    localStorage.setItem('quizSets', JSON.stringify(quizSets))
  }
})

// Open Add Set Modal
function openAddSetModal() {
  currentSet.id = Date.now()
  currentSet.title = ''
  currentSet.questions = []
  editingSet.value = false
  modalOpen.value = true
}

// Open Edit Set Modal
function openEditSetModal(set) {
  currentSet.id = set.id
  currentSet.title = set.title
  currentSet.questions = set.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: [...q.options],
    answer: q.answer
  }))
  editingSet.value = true
  modalOpen.value = true
}

// Add new question
function addQuestion() {
  currentSet.questions.push({ id: Date.now() + Math.random(), question: '', options: ['',''], answer: 0 })
}

// Remove question
function removeQuestion(index) {
  currentSet.questions.splice(index, 1)
}

// Add option to a question
function addOption(qIndex) {
  currentSet.questions[qIndex].options.push('')
}

// Remove option from a question
function removeOption(qIndex, optIndex) {
  currentSet.questions[qIndex].options.splice(optIndex, 1)
}

// Save set
function saveSet() {
  if (!currentSet.title.trim()) return alert('Set title required!')

  const existingIndex = quizSets.findIndex(s => s.id === currentSet.id)

  const setCopy = {
    id: currentSet.id,
    title: currentSet.title,
    questions: currentSet.questions.map(q => ({
      id: q.id || Date.now() + Math.random(),
      question: q.question,
      options: [...q.options],
      answer: q.answer
    }))
  }

  if (existingIndex !== -1) {
    quizSets.splice(existingIndex, 1, setCopy)
  } else {
    quizSets.push(setCopy)
  }

  localStorage.setItem('quizSets', JSON.stringify(quizSets))
  modalOpen.value = false
}

// Close modal
function closeModal() {
  modalOpen.value = false
}
</script>
