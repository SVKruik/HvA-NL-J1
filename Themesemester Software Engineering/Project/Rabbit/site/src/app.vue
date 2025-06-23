<script lang="ts" setup>
import Navbar from "./components/navigation/navbar/Navbar.vue";
import Sidebar from "./components/navigation/sidebar/Sidebar.vue";
import Callout from "./components/admin/components/Callout.vue";
import { isSidebarExcluded } from "./utils/settings";
import { isHopperBanned } from "~/utils/fetch/admin/isHopperBanned";
import { ToastTypes, type ToastItem } from "./assets/customTypes";

const userStore = useUserStore();
const route = useRoute();
const { $event } = useNuxtApp();

// Reactive Data
const isSidebarOpen: Ref<boolean> = ref(false);
const banned: Ref<boolean> = ref(false);

// Computed Data
const whitelisted: ComputedRef<boolean> = computed((): boolean => {
    return ["/"].includes(route.path);
});

async function fetchIsHopperBanned(): Promise<void> {
    try {
        const response = await isHopperBanned(userStore.user.id);
        banned.value = response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

onMounted(async (): Promise<void> => {
    await fetchIsHopperBanned();
});

// Methods

/**
 * Toggles the sidebar open/close state.
 */
function toggleSideBar(): void {
    isSidebarOpen.value = !isSidebarOpen.value;
}

// SEO
useHead({
    // useHead { title } in other components will get picked up and formatted here.
    titleTemplate: (title) => (title ? `${title} - Rabbit` : "Rabbit"),
});
</script>

<template>
    <ToastContainer />
    <div class="min-h-screen bg-main text-font font-sans">
        <NuxtLoadingIndicator color="#F65D24" />
        <OnboardingComponent v-if="userStore.user.init && whitelisted" />
        <main>
            <navbar :onnavclick="toggleSideBar" />
            <span class="flex flex-row w-full px-4">
                <Sidebar v-if="!isSidebarExcluded().value" :open="isSidebarOpen" />
                <div v-if="!banned" class="w-full" :class="{ 'xl:ml-72': !isSidebarExcluded().value }">
                    <NuxtPage />
                </div>
                <div v-else class="flex justify-center max-w-3xl mx-auto px-4">
                    <Callout title="You have been banned."
                        description="If you believe this is a mistake, please contact support." type="warning" />
                </div>
            </span>
        </main>
    </div>
</template>
