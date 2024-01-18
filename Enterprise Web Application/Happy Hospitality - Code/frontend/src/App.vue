<script setup>
import Footer from "@/components/edge/Footer.vue";
import Navbar from "@/components/edge/Navbar.vue";
import Breadcrumb from "./components/edge/Breadcrumb.vue";
</script>

<template>
    <div class='parent'>
        <div class='sub-wrapper'>
            <Navbar></Navbar>
            <Breadcrumb></Breadcrumb>
            <router-view :key="$route.path"></router-view>
        </div>
        <Footer></Footer>
    </div>
</template>

<style scoped>
.parent {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
</style>
