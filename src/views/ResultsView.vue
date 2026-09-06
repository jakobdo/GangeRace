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

function practiceErrors() {
    race.startPracticeErrors()
    router.replace({ name: 'race' })
}

function practiceTables(tables: number[]) {
    race.startPracticeTables(tables)
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
        <section v-if="race.tableStats.value.length" class="practice-options" aria-labelledby="practice-title">
            <p class="eyebrow">Næste runde</p>
            <h2 id="practice-title">Hvad vil du øve?</h2>
            <div class="practice-actions">
                <button class="primary-button" type="button" @click="practiceErrors">Øv alle fejl</button>
                <button class="secondary-button" type="button"
                    @click="practiceTables([race.weakestTable.value!.table])">
                    Øv {{ race.weakestTable.value!.table }}-tabellen
                </button>
                <button v-if="race.tableStats.value.length > 1" class="secondary-button" type="button"
                    @click="practiceTables(race.tableStats.value.map(({ table }) => table))">
                    Øv alle tabeller med fejl
                </button>
            </div>
        </section>
        <button class="primary-button" type="button" @click="retry">Prøv igen</button>
    </section>
</template>