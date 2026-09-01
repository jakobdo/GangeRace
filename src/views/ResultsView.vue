<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ErrorBreakdown from '../components/ErrorBreakdown.vue'
import { useRace } from '../composables/useRace'

const router = useRouter()
const race = useRace()

onMounted(() => {
    if (!race.hasFinished.value) router.replace({ name: 'home' })
})

function retry() {
    race.startRace(race.totalCount.value)
    router.replace({ name: 'race' })
}
</script>

<template>
    <section class="result-area" aria-labelledby="result-title">
        <p class="eyebrow">Løbet er færdigt</p>
        <h1 id="result-title">Godt regnet.</h1>
        <div class="score-grid">
            <div><strong>{{ race.formattedTime.value }}</strong><span>Tid</span></div>
            <div><strong>{{ race.correctCount.value }}/{{ race.totalCount.value }}</strong><span>Rigtige</span></div>
            <div><strong>{{ race.accuracy.value }}%</strong><span>Præcision</span></div>
            <div><strong>{{ race.formattedAverageTime.value }} sek.</strong><span>Pr. regnestykke</span></div>
        </div>
        <ErrorBreakdown :stats="race.tableStats.value" :weakest-table="race.weakestTable.value"
            :get-errors="race.getErrorsForTable" />
        <button class="primary-button" type="button" @click="retry">Prøv igen</button>
    </section>
</template>