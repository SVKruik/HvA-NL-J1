<script lang="ts">
import { RouterView } from 'vue-router';
import NavbarComponent from './components/Navbar.vue';

export default {
    name: "App",
    components: { NavbarComponent },
};
</script>

<template>
    <div class="content-container">
        <NavbarComponent class="nav"></NavbarComponent>
        <RouterView class="content"></RouterView>
    </div>
</template>

<style scoped>
.content-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}
</style>
