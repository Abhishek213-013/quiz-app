<template>
  <nav class="bg-white text-black p-4 flex justify-between items-center">
    <div class="flex items-center space-x-3 cursor-pointer" @click="goHome">
      <img :src="logo" alt="Logo" class="w-8 h-8 object-contain" />
      <h1 class="text-xl text-shadow-cyan-900 font-bold">MindSpark</h1>
    </div>

    <div class="space-x-4">
      <button @click="askSecretKey" class="bg-gray-500 hover:bg-black text-white px-3 py-1 rounded">
        Manage Quizzes
      </button>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import logo from '../assets/logo.png'
import { askSecretKey } from '../utils/adminKey'

const router = useRouter()


function goHome() {
  router.push('/')
}
</script>
