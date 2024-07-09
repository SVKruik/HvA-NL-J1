<script lang="ts">
import { useUserStore } from '@/stores/UserStore';
import { defineComponent } from 'vue';

export default defineComponent({
    name: "HomeAccount",
    setup() {
        return {
            userStore: useUserStore()
        }
    },
});
</script>

<template>
    <div class="content-container flex-col">
        <h1>Account Details</h1>
        <section class="flex-col user-details-container">
            <div class="user-details-item flex">
                <p class="user-detail-identifier">Voornaam</p>
                <p>{{ userStore.user.firstName || "Geen Waarde" }}</p>
            </div>
            <div class="user-details-item flex">
                <p class="user-detail-identifier">Achternaam</p>
                <p>{{ userStore.user.lastName || "Geen Waarde" }}</p>
            </div>
            <div class="user-details-item flex">
                <p class="user-detail-identifier">Email</p>
                <p>{{ userStore.user.email }}</p>
            </div>
            <div class="user-details-item flex">
                <p class="user-detail-identifier">Voorkeurstaal</p>
                <p>{{ userStore.user.language || "Geen Waarde" }}</p>
            </div>
            <div class="user-details-item flex">
                <p class="user-detail-identifier">Type</p>
                <p>{{ userStore.user.type }}</p>
            </div>
            <div class="user-details-item flex">
                <p class="user-detail-identifier">Ingeschakeld</p>
                <p>{{ userStore.user.enabled ? "Ja" : "Nee" }}</p>
            </div>
            <div class="user-details-item flex">
                <p class="user-detail-identifier">ID</p>
                <p>{{ userStore.user.id }}</p>
            </div>
        </section>
        <a class="button" href="https://myaccount.microsoft.com/" target="_blank">Bewerk Account</a>
    </div>
</template>

<style scoped>
.content-container {
    gap: 80px;
}

.user-details-item {
    justify-content: space-between;
    width: 450px;
}

.button {
    width: 200px;

}

a:hover {
    color: var(--color-text-light);
}
</style>
