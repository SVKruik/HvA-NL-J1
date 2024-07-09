<script lang="ts">
import { defineComponent } from 'vue';
import type { PopupItem } from '@/assets/customTypes';
import PopupItemComponent from './PopupItemComponent.vue';

export default defineComponent({
    name: "PopupContainer",
    components: {
        PopupItemComponent
    },
    props: {
        "pendingPopups": { type: Array<PopupItem>, required: true },
    }
});
</script>

<template>
    <section class="popup-container flex-col">
        <PopupItemComponent v-for="popup in pendingPopups" :id="popup.id" :key="popup.id" :popupData="popup">
        </PopupItemComponent>
    </section>
</template>

<style scoped>
.popup-container {
    gap: 10px;
    width: 700px;
    position: fixed;
    left: 50%;
    bottom: 15px;
    transform: translateX(-50%);
    z-index: 1;
}
</style>