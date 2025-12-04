<script setup lang="ts">
import type { PropType } from 'vue';
import { Radar } from 'vue-chartjs';
import type { ChartData } from '~/assets/customTypes';
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, Filler, PointElement, LineElement } from 'chart.js';

// Setup
ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, Filler, PointElement, LineElement);

// Props
defineProps({
    "label": { type: String, required: true },
    "options": { type: Object, required: true },
    "data": { type: Object as PropType<ChartData | null>, required: true }
});
</script>

<template>
    <Radar v-if="data" :aria-label="label" :data="data" :options="options">
        Er ging iets mis tijdens het laden van de grafiek.</Radar>
    <strong v-else>Er ging iets mis tijdens het laden van de grafiek. Probeer het later nog een keer.</strong>
</template>
