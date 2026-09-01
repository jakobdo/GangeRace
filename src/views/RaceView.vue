<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import RaceQuestion from '../components/RaceQuestion.vue'
import { useRace } from '../composables/useRace'

const router = useRouter()
const race = useRace()

onMounted(() => {
    if (!race.hasStarted.value) router.replace({ name: 'home' })
    if (race.hasFinished.value) router.replace({ name: 'results' })
})

function submitAnswer(answer: string | number | null) {
    if (race.submitAnswer(answer)) router.replace({ name: 'results' })
}
</script>

<template>
    <RaceQuestion v-if="race.currentExercise.value" :exercise="race.currentExercise.value"
        :index="race.currentIndex.value" :total-count="race.totalCount.value" :correct-count="race.correctCount.value"
        @answer="submitAnswer" />
</template>