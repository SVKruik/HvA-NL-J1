<script lang="ts" setup>
import { ButtonComponent as Button } from "#components";
import UserSidebar from "./UserSidebar.vue";
import AdminSidebar from "./AdminSidebar.vue";
import { useRoute } from "vue-router";

const route = useRoute();

defineProps<{
    open: boolean;
}>();
</script>

<template>
    <div
        :class="`xl:flex w-72 fixed z-20 h-[calc(100vh-4rem)] flex-col gap-8 overflow-y-scroll p-4 bg-fill rounded-t-2xl ${
            open ? 'flex' : 'hidden'
        }`"
    >
        <AdminSidebar v-if="route.path.startsWith('/admin')" />
        <UserSidebar v-else />

        <div class="flex flex-col mt-auto">
            <Button
                label="About"
                color="fill"
                classname="mt-1 !justify-start"
                @click="navigateTo(`/about`)"
            >
                <i class="fi fi-sr-info size-3.5" />
            </Button>
            <Button
                label="Support"
                color="fill"
                classname="mt-1 !justify-start"
                @click="navigateTo(`/support`)"
            >
                <i class="fi fi-sr-user-headset size-3.5" />
            </Button>
            <Button
                label="Terms and Conditions"
                color="fill"
                classname="mt-1 !justify-start"
                @click="navigateTo(`/toc`)"
            >
                <i class="fi fi-sr-form size-3.5" />
            </Button>
            <p class="text-gray-500 text-xs my-4 text-center">
                &copy; 2025 Rabbit. All rights reserved.
            </p>
        </div>
    </div>
</template>
