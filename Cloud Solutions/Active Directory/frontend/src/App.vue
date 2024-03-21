<script lang="ts">
import { RouterView } from 'vue-router';
import NavbarComponent from './components/Navbar.vue';

export default {
    name: "App",
    components: { NavbarComponent },
};
</script>

<template>
    <NavbarComponent class="nav"></NavbarComponent>
    <RouterView class="content"></RouterView>
</template>

<style scoped>
.content {
    height: 100%;
}
</style>
