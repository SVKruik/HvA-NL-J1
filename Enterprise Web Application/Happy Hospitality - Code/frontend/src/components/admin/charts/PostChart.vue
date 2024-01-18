<!-- @author Stefan Kruik -->

<script lang='js'>
import * as chartConfig from "@/assets/chart-configs/post-chart-config.js";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import { Line as ChartLine } from "vue-chartjs";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
    name: "PostChart",
    components: {
        ChartLine
    },
    data() {
        return chartConfig;
    }
};
</script>

<template>
    <div class='chart-wrapper'>
        <ChartLine :data='data' :options='options'/>
    </div>
</template>
