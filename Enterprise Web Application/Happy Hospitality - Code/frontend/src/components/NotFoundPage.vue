<!-- @author Mike Schaper -->

<script lang='js'>
import { documentTitle } from "@/utilities/formatController";

export default {
    name: "NotFoundPage",
    created() {
        documentTitle("Pagina niet gevonden!");
    },
};
</script>

<template>
    <section class='not-found-section'>
        <div class='content-wrapper'>
            <h1>404 Pagina niet gevonden</h1>
            <p>
                Klik
                <router-link class='link' to='/'>hier</router-link>
                om terug te gaan.
            </p>
        </div>
    </section>
</template>

<style scoped>
.not-found-section {
    min-height: 70vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.content-wrapper {
    padding-top: 100px;
}

.link {
    color: var(--accent-b);
}
</style>
