<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Exercise } from '../composables/useRace'

type TableStat = { table: number; wrong: number; correct: number }
const props = defineProps<{ stats: TableStat[]; weakestTable: TableStat | null; getErrors: (table: number) => Exercise[] }>()
const selectedTable = ref<number | null>(null)
const selectedErrors = computed(() => selectedTable.value === null ? [] : props.getErrors(selectedTable.value))

function toggleTable(table: number) {
    selectedTable.value = selectedTable.value === table ? null : table
}
</script>

<template>
    <div v-if="weakestTable" class="insight">
        <p class="insight-label">Mest at øve</p>
        <p><strong>{{ weakestTable.table }}-tabellen</strong> havde {{ weakestTable.wrong }} fejl.</p>
        <button class="show-errors-button" type="button" @click="toggleTable(weakestTable.table)">
            {{ selectedTable === weakestTable.table ? 'Skjul fejlene' : `Se fejlene i ${weakestTable.table}-tabellen` }}
        </button>
    </div>
    <div v-else class="insight success">
        <p class="insight-label">Fejlfrit løb</p>
        <p><strong>Alle 100 svar var rigtige.</strong></p>
    </div>

    <div v-if="stats.length" class="table-list" aria-label="Fejl fordelt på tabeller">
        <div v-for="stat in stats" :key="stat.table">
            <button class="table-stat" type="button" :aria-expanded="selectedTable === stat.table"
                @click="toggleTable(stat.table)">
                <span>{{ stat.table }}-tabellen</span>
                <span>{{ stat.correct }} rigtige · {{ stat.wrong }} fejl · Se fejl</span>
            </button>
        </div>
    </div>
    <div v-if="selectedTable !== null" class="error-details" aria-live="polite">
        <p class="error-details-title">Dine fejl i {{ selectedTable }}-tabellen</p>
        <p v-for="exercise in selectedErrors" :key="exercise.id">
            {{ exercise.left }} x {{ exercise.right }} = {{ exercise.left * exercise.right }}
            <span>Dit svar: {{ exercise.answer.trim() || 'intet svar' }}</span>
        </p>
    </div>
</template>