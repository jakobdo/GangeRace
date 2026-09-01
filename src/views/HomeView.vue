<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRace } from '../composables/useRace'

const router = useRouter()
const race = useRace()
const questionCount = ref(100)

function startRace() {
    race.startRace(questionCount.value)
    router.push({ name: 'race' })
}
</script>

<template>
    <section class="welcome" aria-labelledby="race-title">
        <h1 id="race-title">Gangetabellen på tid.</h1>
        <p class="intro">Vælg hvor mange regnestykker du vil løse. De trækkes fra alle kombinationer fra 1 x 1 til 10 x
            10.</p>
        <label class="question-count" for="question-count">
            <span>Antal regnestykker</span>
            <input id="question-count" v-model.number="questionCount" type="number" min="1" max="100" step="1"
                required />
        </label>
        <button class="primary-button" type="button" @click="startRace">Start løbet</button>
        <p class="quiet-note">Gangestykkerne blandes ved hver ny runde.</p>
    </section>
</template>