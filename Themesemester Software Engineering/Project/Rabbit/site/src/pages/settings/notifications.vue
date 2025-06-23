<script setup lang="ts">
import { ButtonComponent as Button } from '#components';
import { ToastTypes, type ToastItem } from '~/assets/customTypes';
import { useFetchNotificationSettings } from '~/utils/fetch/user/useFetchNotificationSettings';
import { useFetchUpdateNotificationSettings } from '~/utils/fetch/user/useFetchUpdateNotificationSettings';
const { $event } = useNuxtApp();
const userStore = useUserStore();

// Reactive Data
const formData = reactive({
    post_comment: true,
    post_praise: true,
    comment_reply: true,
    comment_praise: true,
    buddy_accepted: true,
    buddy_request: true,
    tail_accepted: true,
    tail_request: true,
    new_achievement: true
});

// Lifecycle Hooks
onMounted(async () => {
    try {
        const rawData = await useFetchNotificationSettings(userStore.user.id);
        formData.post_comment = Boolean(rawData.post_comment);
        formData.post_praise = Boolean(rawData.post_praise);
        formData.comment_reply = Boolean(rawData.comment_reply);
        formData.comment_praise = Boolean(rawData.comment_praise);
        formData.buddy_accepted = Boolean(rawData.buddy_accepted);
        formData.buddy_request = Boolean(rawData.buddy_request);
        formData.tail_accepted = Boolean(rawData.tail_accepted);
        formData.tail_request = Boolean(rawData.tail_request);
        formData.new_achievement = Boolean(rawData.new_achievement);
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: error.message || "Something went wrong. Please try again.",
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
        await useFetchUpdateNotificationSettings(userStore.user.id, formData);
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Your notification settings have been updated successfully.",
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
    <form @submit="submitForm" class="flex flex-col gap-8 max-w-96">
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">Content</h2>
            <p class="text-sm mb-4 text-font-light">Notifications related to your creations.</p>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.post_comment" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Someone placed a comment under
                    your post.</span>
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.post_praise" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Someone Praised your
                    post.</span>
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.comment_reply" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Someone replied to your
                    comment.</span>
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.comment_praise" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Someone Praised your
                    comment.</span>
            </label>
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">Buddies & Tails</h2>
            <p class="text-sm mb-4 text-font-light">Messages about your relations.</p>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.buddy_request" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">You have received a Buddy
                    request.</span>
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.buddy_accepted" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Your outgoing Buddy request was
                    accepted.</span>
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.tail_request" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">You have received a Tail
                    request.</span>
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.tail_accepted" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Your outgoing Tail request was
                    accepted.</span>
            </label>
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">Others</h2>
            <p class="text-sm mb-4 text-font-light">Be brought up to speed for these also.</p>
            <label class="inline-flex items-center me-5 cursor-pointer">
                <input v-model="formData.new_achievement" type="checkbox" value="" class="sr-only peer" checked />
                <div
                    class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                </div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">You have unlocked a new
                    Achievement.</span>
            </label>
        </div>
        <Button type="submit" class="w-40 h-8" label="Save Changes"></Button>
    </form>
</template>