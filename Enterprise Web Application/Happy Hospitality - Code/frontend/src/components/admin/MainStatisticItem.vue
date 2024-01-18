<!-- @author Stefan Kruik -->

<script lang='js'>
import { numberFormat } from "@/utilities/formatController";

export default {
    name: "MainStatisticItem",
    methods: {
        numberFormat,
        typeCheck() {
            switch (this.name) {
                case "partner":
                    return "Partners";
                case "entrepreneur":
                    return "Ondernemers";
                case "post":
                    return "Artikelen";
                case "event":
                    return "Evenementen";
            }
        }
    },
    props: {
        name: String,
        value: Number,
        id: Number
    }
};
</script>

<template>
    <div class='main-statistic-item'>
        <h2>{{ numberFormat(value) }}</h2>
        <h3>{{ typeCheck() }}</h3>
    </div>
</template>
<style scoped>
.main-statistic-item {
    width: 90%;
    max-width: 200px;
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--accent-b);
    gap: 10px;
}
</style>
