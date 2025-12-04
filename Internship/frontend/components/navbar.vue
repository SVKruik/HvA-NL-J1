<script setup lang="ts">
import type { LearningGoal_Generic_Datasets, LearningGoal_4_Datasets } from '~/assets/customTypes';

// Reactive Data
const refreshing: Ref<boolean> = ref(false);
const navBarOpen: Ref<boolean> = ref(false);

// Watchers
watch(useRoute(), () => {
    navBarOpen.value = false;
});

// Methods

/**
 * Refresh the content on the page.
 */
async function handleRefresh(): Promise<void> {
    if (refreshing.value) return;
    refreshing.value = true;
    const response0: LearningGoal_Generic_Datasets | number = await useFetchGoal0(true);
    const response2: LearningGoal_Generic_Datasets | number = await useFetchGoal2(true);
    const response3: LearningGoal_Generic_Datasets | number = await useFetchGoal3(true);
    const response4: LearningGoal_4_Datasets | number = await useFetchGoal4(true);
    if (typeof response0 === "number") window.alert(`Data ophalen voor leerdoel 0 ging mis. Probeer later opnieuw. Status code: ${response0}`);
    if (typeof response2 === "number") window.alert(`Data ophalen voor leerdoel 2 ging mis. Probeer later opnieuw. Status code: ${response2}`);
    if (typeof response3 === "number") window.alert(`Data ophalen voor leerdoel 3 ging mis. Probeer later opnieuw. Status code: ${response3}`);
    if (typeof response4 === "number") window.alert(`Data ophalen voor leerdoel 4 ging mis. Probeer later opnieuw. Status code: ${response4}`);
    refreshing.value = false;
}

/**
 * Toggle the navbar.
 */
function toggleNavbar() {
    navBarOpen.value = !navBarOpen.value;
}
</script>

<template>
    <header>
        <span class="overlay" :class="{ 'overlay-open': navBarOpen }" @click="toggleNavbar"></span>
        <nav class="flex compact-nav">
            <NuxtLink to="/" class="flex">
                <ClientOnly>
                    <img src="/Logo.png" alt="Logo" />
                </ClientOnly>
                <h2 class="title">SK Metrics</h2>
            </NuxtLink>
            <button type="button" class="nav-button" @click="toggleNavbar" :class="{ 'nav-button-open': !navBarOpen }">
                <i class="fa-regular fa-bars"></i>
            </button>
        </nav>
        <nav class="main-nav" :class="{ 'nav-open': navBarOpen }">
            <NuxtLink class="nav-link" active-class="active-nav-link" to="/">Home</NuxtLink>
            <NuxtLink class="nav-link" active-class="active-nav-link" to="/graph">Grafieken</NuxtLink>
            <NuxtLink class="nav-link" active-class="active-nav-link" to="/table">Tabellen</NuxtLink>
            <a class="nav-link" href="https://github.com/SVKruik-Organization/SK-Metrics" @click="navBarOpen = false"
                target="_blank">Repository</a>
            <button type="button" class="flex refresh-button" @click.prevent="handleRefresh"
                :class="{ 'reloading': refreshing }">
                <p v-if="navBarOpen">Herladen</p>
                <i class="fa-regular fa-arrows-rotate"></i>
            </button>
        </nav>
    </header>
</template>

<style scoped>
header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    border-radius: 50%;
    width: 30px;
    aspect-ratio: 1 / 1;
    object-fit: cover;
}

.overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000090;
    backdrop-filter: blur(3px);
    z-index: 1;
}

.overlay-open {
    display: block;
}

.compact-nav,
.nav-button {
    display: none;
}

.nav-button i {
    font-size: 20px;
}

.nav-button-open {
    display: block;
}

.main-nav {
    width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    margin-bottom: 35px;
}

.nav-link {
    height: 70px;
    line-height: 80px;
    box-sizing: border-box;
    color: var(--font);
    text-decoration: none;
}

.active-nav-link {
    border-bottom: 2px solid var(--border);
}

.refresh-button {
    position: fixed;
    justify-content: center;
    top: 10px;
    right: 10px;
    background-color: var(--fill);
    border: 1px solid var(--border);
    border-radius: var(--border-radius-low);
    box-sizing: border-box;
    padding: 5px;
    width: 35px;
    aspect-ratio: 1 / 1;
    transition: background-color 0.3s;
}

.refresh-button:hover {
    background-color: var(--fill-light);
}

@media (width <=570px) {
    .main-nav {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        flex-direction: column;
        z-index: 2;
        background-color: var(--border);
        align-items: center;
        box-sizing: border-box;
        border-bottom: none;
        padding: 20px 0;
        gap: 20px;
    }

    .nav-open {
        display: flex;
    }

    .compact-nav {
        display: flex;
        align-items: center;
        background-color: var(--fill-light);
        justify-content: space-between;
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px;
    }

    .compact-nav a {
        text-decoration: none;
    }

    .nav-link {
        background-color: var(--fill);
        width: 90%;
        height: 30px;
        line-height: 10px;
        color: var(--font);
        box-sizing: border-box;
        padding: 10px 20px;
        border-radius: var(--border-radius-low);
    }

    .active-nav-link {
        background-color: #6EC20770;
    }

    .refresh-button {
        width: 90%;
        aspect-ratio: unset;
        position: unset;
        height: 30px;
        justify-content: space-between;
        padding: 10px 20px;
    }
}
</style>