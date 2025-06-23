<script lang="ts" setup>

definePageMeta({
    middleware: ["auth"],
});
</script>

<template>
    <div class="flex-1 flex flex-col gap-5 w-full max-w-5xl mx-auto">
        <div class="bg-fill rounded-xl p-4 pb-6 w-full flex flex-col gap-4">
            <h1 class="text-xl font-bold">Settings</h1>
            <div class="flex gap-4">
                <NuxtLink to="/settings/account" class="border border-transparent box-border p-2"
                    active-class="border-b-brand">
                    Account</NuxtLink>
                <NuxtLink to="/settings/profile" class="border border-transparent box-border p-2"
                    active-class="border-b-brand">
                    Profile</NuxtLink>
                <NuxtLink to="/settings/security" class="border border-transparent box-border p-2"
                    active-class="border-b-brand">
                    Security</NuxtLink>
                <NuxtLink to="/settings/notifications" class="border border-transparent box-border p-2"
                    active-class="border-b-brand">
                    Notifications</NuxtLink>
                <NuxtLink to="/settings/feed" class="border border-transparent box-border p-2"
                    active-class="border-b-brand">
                    Feed</NuxtLink>
            </div>
            <NuxtPage />
        </div>
    </div>
</template>