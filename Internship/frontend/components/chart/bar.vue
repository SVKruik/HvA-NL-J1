<script setup lang="ts">
import type { PropType } from 'vue';
import { Bar } from 'vue-chartjs';
import type { ChartData } from '~/assets/customTypes';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Setup
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Props
defineProps({
    "label": { type: String, required: true },
    "options": { type: Object, required: true },
    "data": { type: Object as PropType<ChartData>, required: true }
});
</script>

<template>
    <Bar :aria-label="label" :data="data" :options="options">Er ging iets mis tijdens het laden van de grafiek.</Bar>
</template>
