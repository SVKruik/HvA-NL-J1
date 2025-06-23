<script setup lang="ts">
import { ButtonComponent as Button } from '#components';
import { ToastTypes, type ToastItem } from '~/assets/customTypes';
import { useFetchFeedSettings } from '~/utils/fetch/user/useFetchFeedSettings';
import { useFetchUpdateFeedSettings } from '~/utils/fetch/user/useFetchUpdateFeedSettings';
const userStore = useUserStore();
const { $event } = useNuxtApp();

// Reactive Data
const formData = reactive({
    can_view_nsfw: false,
});

// Lifecycle Hooks
onMounted(async () => {
    try {
        const rawData = await useFetchFeedSettings(userStore.user.id);
        formData.can_view_nsfw = Boolean(rawData.can_view_nsfw);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: error.message || "Failed to load feed settings.",
            duration: 3,
        } as ToastItem);
    }
});

// Methods

/**
 * Submits the form data when the user clicks the submit button.
 * @param event The form submission event.
 */
async function submitForm(event: Event): Promise<void> {
    try {
        event.preventDefault();
        await useFetchUpdateFeedSettings(userStore.user.id, formData);
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Feed settings updated successfully.",
            duration: 3,
        } as ToastItem);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

</script>

<template>
    <form @submit="submitForm" class="flex flex-col gap-8 max-w-80">
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">Viewing</h2>
            <p class="text-sm mb-4 text-font-light">Customize how your feed loads.</p>
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">NSFW</h2>
            <p class="text-sm mb-4 text-font-light">Should 18+ content be shown at all? Think of graphic and/or
                sensitive posts.</p>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.can_view_nsfw" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show NSFW content.</span>
            </label>
        </div>
        <Button type="submit" label="Save Changes" class="w-40 h-8"></Button>
    </form>
</template>