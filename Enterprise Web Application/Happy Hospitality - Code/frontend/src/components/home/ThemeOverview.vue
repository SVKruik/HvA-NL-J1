<!-- @author Stefan Kruik -->

<script lang='js'>

export default {
    name: "ThemeOverview",
    methods: {
        /**
         * Link to the dedicated theme page for further details.
         * @param destination
         */
        link(destination) {
            this.$router.push(`/themes/${destination}`);
        }
    }
};
</script>

<template>
    <div class='content-wrapper'>
        <h2>Thema's</h2>
        <section class='theme-container'>
            <div class='theme-item' @click="this.link('energie')">
                <img
                    alt='Theme Image'
                    class='theme-image'
                    src='https://files.stefankruik.com/themes/energie.svg'
                />
                <p class='theme-description'>Energie</p>
            </div>
            <div class='theme-item' @click="this.link('eiwit')">
                <img
                    alt='Theme Image'
                    class='theme-image'
                    src='https://files.stefankruik.com/themes/eiwit.svg'
                />
                <p class='theme-description'>Eiwit</p>
            </div>
            <div class='theme-item' @click="this.link('water')">
                <img
                    alt='Theme Image'
                    class='theme-image'
                    src='https://files.stefankruik.com/themes/water.svg'
                />
                <p class='theme-description'>Water</p>
            </div>
            <div class='theme-item' @click="this.link('verspilling')">
                <img
                    alt='Theme Image'
                    class='theme-image'
                    src='https://files.stefankruik.com/themes/verspilling.svg'
                />
                <p class='theme-description'>Verspilling</p>
            </div>
            <div class='theme-item' @click="this.link('mens')">
                <img
                    alt='Theme Image'
                    class='theme-image'
                    src='https://files.stefankruik.com/themes/mens.svg'
                />
                <p class='theme-description'>Mens</p>
            </div>
            <div class='theme-item' @click="this.link('logistiek')">
                <img
                    alt='Theme Image'
                    class='theme-image'
                    src='https://files.stefankruik.com/themes/logistiek.svg'
                />
                <p class='theme-description'>Logistiek</p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.content-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.theme-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 80px;
    row-gap: 40px;
    justify-items: center;
}

.theme-item {
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

.theme-image {
    width: 50%;
}

@media (width <= 730px) {
    .theme-container {
        row-gap: 0;
        gap: 30px;
        grid-template-columns: 1fr 1fr;
    }

    .theme-item {
        gap: 20px;
    }
}
</style>
