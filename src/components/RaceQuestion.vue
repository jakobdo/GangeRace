<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { Exercise } from '../composables/useRace'

const props = defineProps<{ exercise: Exercise; index: number; totalCount: number; correctCount: number }>()
const emit = defineEmits<{ answer: [value: string | number | null] }>()
const answer = ref<string | number | null>(null)
const answerInput = ref<HTMLInputElement | null>(null)

watch(
    () => props.exercise.id,
    () => {
        answer.value = null
        nextTick(() => answerInput.value?.focus())
    },
    { immediate: true },
)

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
            <label class="answer-label" for="answer">Dit svar</label>
            <input id="answer" ref="answerInput" v-model="answer" class="answer-input" inputmode="numeric"
                autocomplete="off" type="number" min="1" step="1" required />
            <button class="primary-button" type="submit">Næste</button>
        </form>
    </section>
</template>