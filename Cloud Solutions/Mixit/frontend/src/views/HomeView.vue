<script lang="ts">
import type { PopupItem } from '@/assets/customTypes';
import SideBar from '@/components/SideBar.vue';
import { useUserStore } from '@/stores/UserStore';
import { fetchValidateSession } from '@/utils/fetch';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "HomeView",
    emits: [
        "popup"
    ],
    components: {
        SideBar
    },
    setup() {
        return {
            userStore: useUserStore()
        }
    },
    async created() {
        // Authentication Validation
        // if (!this.$cookies.isKey("session")) return this.$router.push("/");
        if (typeof await fetchValidateSession() === "boolean") return this.$router.push("/");
    },
    methods: {
        popup(data: PopupItem) {
            this.$emit("popup", data);
        }
    }
});
</script>

<template>
    <div class="content-parent flex">
        <SideBar></SideBar>
        <RouterView class="dynamic-content" @popup="popup"></RouterView>
    </div>
</template>

<style scoped>
.content-parent {
    gap: 0;
    height: 100vh;
    align-items: baseline;
}

.dynamic-content {
    flex: 1;
    margin-left: 100px;
    box-sizing: border-box;
    padding: 20px;
}
</style>
