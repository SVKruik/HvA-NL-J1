<script setup lang="ts">
import { ButtonComponent as Button } from '#components';
import { ToastTypes, type ToastItem } from '~/assets/customTypes';
import { useFetchDeleteAccount } from '~/utils/fetch/user/useFetchDeleteAccount';
import { useFetchUpdateCredentials } from '~/utils/fetch/user/useFetchUpdateCredentials';
const userStore = useUserStore();
const { $event } = useNuxtApp();

// Reactive Data
const emailInput: Ref<string> = ref("");
const passwordInput: Ref<string | null> = ref(null);
const confirmPasswordInput: Ref<string | null> = ref(null);
const deletePage: Ref<number> = ref(1);

// Methods

/**
 * Submits the form data when the user clicks the submit button.
 * @param event The form submission event.
 */
async function submitForm(event: Event): Promise<void> {
    event.preventDefault();

    try {
        await useFetchUpdateCredentials(emailInput.value, passwordInput.value, confirmPasswordInput.value, userStore.user.id);
        userStore.user.email = emailInput.value;
        passwordInput.value = "";
        confirmPasswordInput.value = "";

        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Your credentials have been updated successfully.",
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

/**
 * Deletes the user account when the user clicks the delete button.
 */
async function deleteAccount(): Promise<void> {
    try {
        await useFetchDeleteAccount(userStore.user.email);
        userStore.signOut();
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Your account has been deleted successfully.",
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
            <h2 class="text-xl font-bold">General</h2>
            <p class="text-sm mb-4 text-font-light">Your login credentials.</p>
            <label for="email" class="text-sm">Email</label>
            <input type="email" v-model="emailInput" :placeholder="userStore.user.email" id="email" name="email"
                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
            <label for="password" class="text-sm">New Password</label>
            <input type="password" v-model="passwordInput" id="password" name="password"
                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
            <label for="confirm-password" class="text-sm">Confirm New Password</label>
            <input type="password" v-model="confirmPasswordInput" id="confirm-password" name="confirm-password"
                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
            <Button type="submit" label="Save" class="mt-4" title="Save your updated information."></Button>
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">Delete Account</h2>
            <p class="text-sm mb-4 text-font-light">Sometimes this is the only way. This action is permanent.</p>
            <template v-if="deletePage === 1">
                <Button type="button" @click="deletePage = 2" variant="outline" title="Delete your account permanently."
                    classname="border-red-500 !text-red-500">
                    Delete Account
                </Button>
            </template>
            <template v-else>
                <p class="text-sm mb-4 font-bold text-red-500">We are sorry to see you go. You will lose access to your
                    account, and all your content like posts and comments are removed. Are you 100% sure?</p>
                <Button type="button" @click="deleteAccount" variant="outline" title="Delete your account permanently."
                    classname="!border-red-500 !bg-red-500 !text-white">
                    I'm sure, delete my account
                </Button>
            </template>
        </div>
    </form>
</template>