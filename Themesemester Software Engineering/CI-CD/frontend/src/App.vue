<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
    <div class="flex-col content">
        <NavBar />
        <RouterView />
    </div>
</template>

<style scoped>
.content {
    gap: 20px;
}
</style>