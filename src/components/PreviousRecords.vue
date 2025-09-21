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
      <aside class="w-64 bg-gradient-to-r from-indigo-600 to-blue-500 bg-opacity-20 backdrop-blur-md shadow-md p-6 hidden md:flex flex-col space-y-5">
        <router-link to="/" class="font-semibold text-black hover:text-indigo-200">Dashboard</router-link>
        <router-link to="/quiz" class="font-semibold text-black hover:text-indigo-200">Take Quiz</router-link>
        <!-- Secret key check for Manage Quizzes -->
        <a @click.prevent="askSecretKey" class="font-semibold text-black hover:text-indigo-200 cursor-pointer">Manage Quizzes</a>
        <router-link to="/records" class="font-semibold text-black hover:text-indigo-200">Previous Records</router-link>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:pl-8">
        <h1 class="text-3xl md:text-4xl font-bold text-indigo-950 mb-6 drop-shadow-lg">Previous Quiz Records</h1>

        <!-- Filters -->
        <div class="flex flex-col md:flex-row flex-wrap gap-4 mb-6 items-start md:items-center">
          <input v-model="filterName" placeholder="Filter by name"
                 class="p-3 rounded-lg border border-gray-300 flex-1" />
          <input type="date" v-model="filterDate" class="p-3 rounded-lg border border-gray-300" />
          <button @click="applyFilters"
                  class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl shadow transform hover:scale-105 transition">
            Apply Filter
          </button>
          <button @click="resetFilters"
                  class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-xl shadow transform hover:scale-105 transition">
            Reset
          </button>
        </div>

        <!-- Records List -->
        <transition-group name="slide-fade" tag="div">
          <div v-for="(record, index) in filteredRecords" :key="record.id || index"
               class="p-6 bg-gradient-to-r from-indigo-700 to-purple-800 bg-opacity-20 backdrop-blur-md rounded-xl shadow mb-4 transition transform hover:scale-105 hover:shadow-2xl cursor-pointer">
            <p class="font-semibold text-white text-lg">{{ index + 1 }}. {{ record.name }}</p>
            <p class="text-white">Date: {{ record.date }}</p>
            <p class="text-white">Score: {{ record.score }} / {{ record.total }}</p>
          </div>
        </transition-group>

        <div v-if="filteredRecords.length === 0" class="text-red-300 text-lg mt-4">
          No records found.
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import logo from '../assets/logo.png'



  const router = useRouter()
  const records = reactive([])
  const filteredRecords = reactive([])

  const filterName = ref('')
  const filterDate = ref('')

  // Load stored records
  onMounted(() => {
    const stored = JSON.parse(localStorage.getItem('quizResults')) || []
    stored.forEach(r => records.push(r))
    stored.forEach(r => filteredRecords.push(r))
  })

  // Secret key check for Manage Quizzes
  function askSecretKey() {
    const key = prompt("Enter Admin Key:")
    if (key === "abhishek_30") {
      router.push('/manage')
    } else {
      alert("Incorrect key!")
    }
  }

  // Filter functions
  function applyFilters() {
    filteredRecords.splice(0, filteredRecords.length)
    records.forEach(r => {
      const matchName = filterName.value ? r.name.toLowerCase().includes(filterName.value.toLowerCase()) : true
      const matchDate = filterDate.value ? r.date === filterDate.value : true
      if (matchName && matchDate) filteredRecords.push(r)
    })
  }

  function resetFilters() {
    filterName.value = ''
    filterDate.value = ''
    filteredRecords.splice(0, filteredRecords.length)
    records.forEach(r => filteredRecords.push(r))
  }
  function goDashboard() {
    router.push('/')
  }

</script>

<style>
/* Slide-fade animation */
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
</style>
