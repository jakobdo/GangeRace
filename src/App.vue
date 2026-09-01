<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import { useRace } from './composables/useRace'

const route = useRoute()
const race = useRace()
</script>

<template>
  <main class="race-app">
    <AppHeader :show-time="race.hasStarted.value && route.name !== 'home'" :time="race.formattedTime.value" />
    <RouterView />
  </main>
</template>
