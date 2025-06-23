<script setup lang="ts">
import { ButtonComponent as Button } from '#components';
import { ToastTypes, type ToastItem } from '~/assets/customTypes';
import { useFetch2FASetup } from '~/utils/fetch/user/useFetch2FASetup';
import { useFetchSecurityStatus } from '~/utils/fetch/user/useFetchSecurityStatus';
import { useFetchSendVerifyEmailAccount } from '~/utils/fetch/user/useFetchSendVerifyEmailAccount';
import { useFetchVerifyEmailAccount } from '~/utils/fetch/user/useFetchVerifyEmailAccount';
const userStore = useUserStore();
const { $event } = useNuxtApp();

// Reactive Data
const verifyDate: Ref<Date | null> = ref(null);
const verificationProcess: Ref<boolean> = ref(false);
const verificationPinInput: Ref<number | null> = ref(null);
const mfaDate: Ref<Date | null> = ref(null);

// Lifecycle Hooks
onMounted(async () => {
    try {
        const rawDates = await useFetchSecurityStatus(userStore.user.id);
        verifyDate.value = rawDates.date_verification ? new Date(rawDates.date_verification) : null;
        mfaDate.value = rawDates.date_2fa ? new Date(rawDates.date_2fa) : null;
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
        await useFetchVerifyEmailAccount(userStore.user.email, verificationPinInput.value as number);
        verificationProcess.value = false;
        verifyDate.value = new Date();
        verificationPinInput.value = null;
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Your account has been verified successfully.",
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

async function enableVerification(): Promise<void> {
    try {
        await useFetchSendVerifyEmailAccount(userStore.user.email);
        verificationProcess.value = true;
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Verification email sent successfully. Please check your inbox.",
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

async function toggle2FA(status: boolean): Promise<void> {
    try {
        await useFetch2FASetup(status, userStore.user.email, userStore.user.id);
        mfaDate.value = status ? new Date() : null;
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: status ? "2FA has been enabled successfully." : "2FA has been disabled successfully.",
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
            <h2 class="text-xl font-bold">Verification</h2>
            <p class="text-sm mb-4 text-font-light">Required to enable the platform's full potential.</p>
            <div v-if="verifyDate" class="flex flex-col">
                <p class="text-sm font-bold">You verified your account on {{ verifyDate.toLocaleDateString() }}.</p>
            </div>
            <div v-else class="flex flex-col gap-4">
                <template v-if="verificationProcess">
                    <p class="text-sm font-bold">Please submit the code from the email here:</p>
                    <input type="number" maxlength="6" minlength="6" min="0" max="999999" v-model="verificationPinInput"
                        class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none no-spinner" />
                    <div class="flex gap-2 items-center">
                        <Button label="Submit Code" type="submit" classname="w-40 h-8"></Button>
                        <Button label="Cancel" type="button" @click="verificationProcess = false" variant="outline"
                            classname="w-40 h-8"></Button>
                    </div>
                    <p class="text-sm text-font-light">If you didn't receive the code, please check your spam folder.
                    </p>
                </template>
                <template v-else>
                    <p class="text-sm font-bold">You have not verified your account yet.</p>
                    <Button label="Verify Account" type="button" @click="enableVerification"
                        classname="w-40 h-8"></Button>
                </template>
            </div>
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-xl font-bold">2FA</h2>
            <p class="text-sm mb-4 text-font-light">An extra security layer when logging in.</p>
            <div v-if="mfaDate" class="flex flex-col gap-4">
                <p class="text-sm font-bold">You activated 2FA on {{ mfaDate.toLocaleDateString() }}.</p>
                <Button label="Disable 2FA" type="button" @click="toggle2FA(false)" variant="outline"
                    classname="w-40 h-8"></Button>
            </div>
            <div v-else class="flex flex-col gap-4">
                <p class="text-sm font-bold">You have not activated 2FA yet.</p>
                <Button label="Enable 2FA" type="button" @click="toggle2FA(true)" classname="w-40 h-8"></Button>
            </div>
        </div>
    </form>
</template>