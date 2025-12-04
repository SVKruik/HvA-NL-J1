<script setup lang="ts">
import type { PropType } from 'vue';
import { Line } from 'vue-chartjs';
import type { ChartData } from '~/assets/customTypes';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';

// Setup
ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale);

// Props
defineProps({
    "label": { type: String, required: true },
    "options": { type: Object, required: true },
    "data": { type: Object as PropType<ChartData | null>, required: true }
});
</script>

<template>
    <Line v-if="data" :aria-label="label" :data="data" :options="options">
        Er ging iets mis tijdens het laden van de grafiek.</Line>
    <strong v-else>Er ging iets mis tijdens het laden van de grafiek. Probeer het later nog een keer.</strong>
</template>
