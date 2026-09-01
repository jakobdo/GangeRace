<script setup lang="ts">
defineProps<{ time: string; showTime: boolean }>()
</script>

<template>
    <header class="topbar">
        <RouterLink class="brand" to="/">GangeRace</RouterLink>
        <p v-if="showTime" class="timer" aria-live="polite">{{ time }}</p>
    </header>
</template>