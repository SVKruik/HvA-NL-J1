<!-- @author Stefan Kruik -->

<script lang='js'>

import { documentTitle } from "@/utilities/formatController";
import { getItem } from "@/utilities/sessionController";

export default {
    name: "AdminLanding",
    data() {
        return {
            "rank": getItem("rank")
        };
    },
    mounted() {
        documentTitle("Administratie");
        if (this.rank === "Super User") {
            const adminElements = document.getElementsByClassName("admin");
            for (let i = 0; i < adminElements.length; i++) {
                adminElements[i].classList.add("disabled-tile");
            }
        }
    },
    methods: {
        tileClick(target, elevated) {
            if (elevated && this.rank !== "Administrator") return;
            this.$router.push(`/admin/${target}`);
        }
    }
};
</script>
<template>
    <div class='container'>
        <section class='tile-container'>
            <div class='tile admin' @click="this.tileClick('admins', true)">
                <img
                    alt='Tile Image'
                    class='tile-image'
                    src='https://files.stefankruik.com/themes/mens.svg'
                />
                <p class='tile-description'>Administratoren</p>
            </div>
            <div class='tile admin' @click="this.tileClick('partners', true)">
                <img
                    alt='Tile Image'
                    class='tile-image'
                    src='https://files.stefankruik.com/themes/mens.svg'
                />
                <p class='tile-description'>Partners</p>
            </div>
            <div
                class='tile admin'
                @click="this.tileClick('entrepreneurs', true)"
            >
                <img
                    alt='Tile Image'
                    class='tile-image'
                    src='https://files.stefankruik.com/themes/mens.svg'
                />
                <p class='tile-description'>Ondernemers</p>
            </div>
            <div class='tile admin' @click="this.tileClick('statistics', true)">
                <img
                    alt='Tile Image'
                    class='tile-image'
                    src='https://files.stefankruik.com/themes/logistiek.svg'
                />
                <p class='tile-description'>Statistieken</p>
            </div>
            <div class='tile' @click="this.tileClick('posts', false)">
                <img
                    alt='Tile Image'
                    class='tile-image'
                    src='https://files.stefankruik.com/themes/mens.svg'
                />
                <p class='tile-description'>Artikelen</p>
            </div>
            <div class='tile' @click="this.tileClick('events', false)">
                <img
                    alt='Tile Image'
                    class='tile-image'
                    src='https://files.stefankruik.com/themes/mens.svg'
                />
                <p class='tile-description'>Evenementen</p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.tile-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 80px;
    justify-items: center;
    user-select: none;
}

.tile {
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1/1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    box-sizing: border-box;
    border: 1px solid var(--accent-b);
    cursor: pointer;
}

.tile-image {
    width: 30%;
}

.disabled-tile {
    border: 2px solid grey;
    opacity: 0.5;
    cursor: not-allowed;
}

@media (width <= 730px) {
    .tile-container {
        row-gap: 0;
        gap: 30px;
        grid-template-columns: 1fr 1fr;
    }

    .tile {
        gap: 20px;
    }
}

@media (width <= 385px) {
    .tile-container {
        gap: 10px;
    }
}
</style>
