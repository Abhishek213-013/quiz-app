<template>
  <div class="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500">
    <!-- Navbar -->
    <nav class="w-full bg-indigo-600 bg-opacity-20 backdrop-blur-md p-4 flex items-center shadow-md">
      <div class="flex items-center space-x-3 cursor-pointer" @click="$router.push('/')">
        <!-- Logo -->
        <img :src="logo" alt="Logo" class="w-10 h-10 object-contain">
        <!-- Title -->
        <div class="text-white text-2xl font-bold drop-shadow-lg">MindSpark</div>
      </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="flex flex-col items-center justify-center p-6 mt-16 w-full max-w-5xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-12 drop-shadow-lg text-center cursor-pointer" 
          @click="$router.push('/')">
        Quiz App Dashboard
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <div @click="$router.push('/quiz')" 
             class="bg-indigo-900 bg-opacity-20 backdrop-blur-md text-cyan-300 font-semibold text-xl p-8 rounded-2xl cursor-pointer shadow-lg transform transition hover:scale-105 hover:bg-amber-400/20 hover:shadow-amber-400/50">
          Take Quiz
        </div>

        <button @click="askSecretKey" 
                class="bg-indigo-900 bg-opacity-20 backdrop-blur-md text-cyan-300 font-semibold text-xl p-8 rounded-2xl cursor-pointer shadow-lg transform transition hover:scale-105 hover:bg-amber-400/20 hover:shadow-amber-400/50">
          Manage Quizzes
        </button>

        <div @click="$router.push('/records')" 
             class="bg-indigo-900 bg-opacity-20 backdrop-blur-md text-cyan-300 font-semibold text-xl p-8 rounded-2xl cursor-pointer shadow-lg transform transition hover:scale-105 hover:bg-amber-400/20 hover:shadow-amber-400/50">
          Previous Records
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'



const router = useRouter()

function askSecretKey() { 
  const key = prompt("Enter Admin Key:")
  if (key === null) return // Handle cancel
  if (key === "admin123") { 
    router.push('/manage') 
  } else { 
    alert("Incorrect key!") 
  } 
} 
</script>
