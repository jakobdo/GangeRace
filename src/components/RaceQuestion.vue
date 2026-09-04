<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { Exercise } from '../composables/useRace'

const props = defineProps<{ exercise: Exercise; index: number; totalCount: number; correctCount: number }>()
const emit = defineEmits<{ answer: [value: string | number | null] }>()
const answer = ref<string | number | null>(null)
const answerInput = ref<HTMLInputElement | null>(null)

// Shrink squares as rows/columns grow so the whole grid always fits without cropping.
const squareSize = computed(() => {
    const maxBoxSize = 220
    const gap = 5
    const byRows = (maxBoxSize + gap) / props.exercise.left - gap
    const byColumns = (maxBoxSize + gap) / props.exercise.right - gap
    return Math.max(10, Math.min(28, byRows, byColumns))
})

watch(
    () => props.exercise.id,
    () => {
        answer.value = null
        nextTick(() => answerInput.value?.focus())
    },
    { immediate: true },
)

// Auto-advance as soon as the typed answer is correct, without waiting for submit.
watch(answer, (value) => {
    if (value !== null && Number(value) === props.exercise.left * props.exercise.right) {
        submit()
    }
})

function submit() {
    emit('answer', answer.value)
}
</script>

<template>
    <section class="exercise-area" aria-labelledby="exercise-title">
        <div class="progress-row">
            <p>Stykke {{ index + 1 }} af {{ totalCount }}</p>
            <p>{{ correctCount }} rigtige</p>
        </div>
        <div class="progress-track" aria-hidden="true">
            <span :style="{ width: `${(index / totalCount) * 100}%` }"></span>
        </div>
        <form class="answer-form" @submit.prevent="submit">
            <p id="exercise-title" class="equation">{{ exercise.left }} <span>*</span> {{ exercise.right }}</p>
            <div class="square-grid"
                :style="{ gridTemplateColumns: `repeat(${exercise.right}, 1fr)`, '--square-size': `${squareSize}px` }"
                aria-hidden="true">
                <span v-for="square in exercise.left * exercise.right" :key="square" class="square"></span>
            </div>
            <label class="answer-label" for="answer">Dit svar</label>
            <input id="answer" ref="answerInput" v-model="answer" class="answer-input" inputmode="numeric"
                autocomplete="off" type="number" min="1" step="1" required />
            <button class="primary-button" type="submit">Næste</button>
        </form>
    </section>
</template>