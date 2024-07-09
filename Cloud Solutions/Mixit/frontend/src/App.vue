<script lang="ts">
import { defineComponent } from 'vue';
import PopupContainer from './components/PopupContainer.vue';
import type { PopupItem } from './assets/customTypes';

export default defineComponent({
    name: "App",
    components: {
        PopupContainer
    },
    methods: {
        popup(popupPayload: PopupItem) {
            this.pendingPopups.push(popupPayload);
        }
    },
    data() {
        return {
            "pendingPopups": [] as Array<PopupItem>
        }
    },
});
</script>

<template>
    <PopupContainer ref="notificationPopup" :pendingPopups="pendingPopups"></PopupContainer>
    <RouterView @popup="popup"></RouterView>
</template>

<style scoped></style>
