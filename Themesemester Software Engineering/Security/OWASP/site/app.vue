<script setup lang="ts">
import type { RouteLocation } from "vue-router";
import "~/assets/css/base.css";
import "~/assets/css/settings.css";

// Life Cycle
onMounted(async () => {
    setTimeout(() => {
        setDocumentTitle(useRoute().path);
    }, 100);
});

// Watchers
watch(useRoute(), (to: RouteLocation, _from: RouteLocation) => {
    setDocumentTitle(to.path);
});

/**
 * Set the document title based on the route path.
 * @param title The route path.
 */
function setDocumentTitle(title: string): void {
    const split = title.split("/");
    if (split[1]) {
        document.title = `HvA SSRF - ${split[1].charAt(0).toUpperCase() + split[1].slice(1)}`;
    } else document.title = "HvA SSRF | Home";
}
</script>

<template>
    <div class="flex-col content">
        <div class="flex-col top-content">
            <Navbar />
            <main>
                <NuxtPage />
            </main>
        </div>
        <Footer />
    </div>
</template>

<style scoped>
.content {
    justify-content: space-between;
    gap: 30px;
    width: 100%;
    min-height: 100vh;
}

.top-content {
    width: 100%;
}

main {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
}
</style>