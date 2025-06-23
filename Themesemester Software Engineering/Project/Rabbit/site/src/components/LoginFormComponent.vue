<script lang="ts" setup>
import { useFetchLoginEmail } from "~/utils/fetch/auth/useFetchLoginEmail";
import { useFetchRestoreEmailAccount } from "~/utils/fetch/auth/useFetchRestoreEmailAccount";
import { useFetchSendRestoreEmailAccount } from "~/utils/fetch/auth/useFetchSendRestoreEmailAccount";
import { useFetchVerifyRestoreEmailAccount } from "~/utils/fetch/auth/useFetchVerifyRestoreEmailAccount";
import { ButtonComponent as Button } from "#components";
import {
    isValidEmail,
    isValidPassword,
    isValidRecoveryCode,
    isValidUsername,
} from "~/utils/validation";
import { ToastTypes } from "~/assets/customTypes";
import type { RegisterPayload, ToastItem, UserData } from "~/assets/customTypes";
import { useFetchRegisterEmail } from "~/utils/fetch/auth/useFetchRegisterEmail";
import { useFetchVerifyEmailAccount } from "~/utils/fetch/user/useFetchVerifyEmailAccount";
import { useFetch2FAVerify } from "~/utils/fetch/user/useFetch2FAVerify";
const { openInPopup, loggedIn } = useUserSession();
const userStore = useUserStore();
const { $event } = useNuxtApp();

// Props
const props = defineProps({
    initialMode: {
        type: String,
        default: "login",
    },
    isDedicated: {
        type: Boolean,
        default: false,
    },
});

// Reactive Data
const pageMode: Ref<string> = ref("login");
const loginProgressionStep: Ref<number> = ref(0);
const emailInput: Ref<string> = ref("");
const passwordInput: Ref<string> = ref("");
const recoveryCodeInput: Ref<number | null> = ref(null);
const newPasswordInput: Ref<string> = ref("");
const confirmPasswordInput: Ref<string> = ref("");
const registerPayload: Ref<RegisterPayload> = ref({
    email: "",
    username: "",
    language: "en-US",
    loginMethod: "email",
    buddies: [],
});
const profilePictureInput: Ref<File | null> = ref(null);
const bannerInput: Ref<File | null> = ref(null);
const registerButtonLoading: Ref<boolean> = ref(false);

// Lifecycle Hooks
onMounted(() => {
    if (
        Object.keys(userStore.registerUser).length >
        Object.keys(registerPayload.value).length
    ) {
        registerPayload.value = userStore.registerUser;
    }

    // Set the initial mode based on the prop
    if (props.initialMode === "register") {
        loginProgressionStep.value = 5;
        pageMode.value = "register";
    }

    // Page title if it is not a modal component, but a dedicated page
    if (props.isDedicated)
        useHead({
            title: pageMode.value.charAt(0).toUpperCase() + pageMode.value.slice(1),
        });

    if (props.isDedicated && loggedIn.value) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "You are already logged in. Please log out first.",
            duration: 3,
        } as ToastItem);
        navigateTo("/");
    }
});

// Methods

/**
 * Sends a restore email to the user.
 *
 * @param event The event triggered by the form submission.
 */
async function sendRestoreEmailAccount(event: Event): Promise<void> {
    try {
        const formData = new FormData(event.target as HTMLFormElement);
        const email: string = formData.get("email") as string;
        if (!isValidEmail(email))
            throw new Error("Your email address is invalid. Please check for typos.");

        await useFetchSendRestoreEmailAccount(email);
        loginProgressionStep.value = 2;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Verifies the recovery code sent to the user's email.
 *
 * @param event The event triggered by the form submission.
 */
async function verifyRestoreEmailAccount(event: Event): Promise<void> {
    try {
        const formData = new FormData(event.target as HTMLFormElement);
        const recoveryCode: number = parseInt(formData.get("recoveryCode") as string);
        if (!isValidRecoveryCode(recoveryCode))
            throw new Error(
                "The recovery code is invalid. Make sure it is 6 digits long."
            );

        await useFetchVerifyRestoreEmailAccount(recoveryCode, emailInput.value);
        loginProgressionStep.value = 3;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Restores the user's email account by setting a new password.
 *
 * @param event The event triggered by the form submission.
 */
async function restoreEmailAccount(event: Event): Promise<void> {
    try {
        const formData = new FormData(event.target as HTMLFormElement);
        const newPassword: string = formData.get("newPassword") as string;
        const confirmPassword: string = confirmPasswordInput.value;
        if (!isValidPassword(newPassword)) {
            throw new Error(
                "Your password should contain a capital and lowercase letter, a number, a special character and should be atleast 8 characters long."
            );
        } else if (newPassword !== confirmPassword)
            throw new Error("The passwords do not match. Please try again.");

        const response = await useFetchRestoreEmailAccount(
            newPassword,
            confirmPassword,
            emailInput.value
        );
        userStore.setUser(response);

        loginProgressionStep.value = 4;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Logs in the user with the provided email and password.
 *
 * @param email The user's email address.
 * @param password The user's password.
 */
async function loginWithEmail(email: string, password: string): Promise<boolean> {
    try {
        if (!isValidEmail(email))
            throw new Error("Your email address is invalid. Check for typos.");

        const response: UserData | true = await useFetchLoginEmail(email, password);
        if (typeof response === "boolean") return response; // 2FA
        userStore.setUser(response);
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Login success. Welcome back, Hopper!",
            duration: 3,
        } as ToastItem);
        navigateTo("/");
        return true;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
        return false;
    }
}

async function loginWith2FA(email: string, code: number | null): Promise<void> {
    try {
        if (!isValidEmail(email) || !email)
            throw new Error("Your email address is invalid. Check for typos.");
        if (!isValidRecoveryCode(code) || !code)
            throw new Error("The 2FA code is invalid. Make sure it is 6 digits long.");
        const response: UserData = await useFetch2FAVerify(email, code);
        userStore.setUser(response);
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: "Login success. Welcome back, Hopper!",
            duration: 3,
        } as ToastItem);
        navigateTo("/");
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Switches between login and register modes.
 * Changes the UI accordingly.
 */
function switchMode(): void {
    if (pageMode.value === "login") {
        navigateTo("/register");
    } else navigateTo("/login");
}

/**
 * Progresses the UI to the next step in the registration process.
 * Also validates the input fields based on the current step.
 * Not all steps require validation.
 *
 * @param toStep The step to progress to.
 */
async function progressRegister(toStep: number): Promise<void> {
    try {
        if (toStep < 5 || toStep === loginProgressionStep.value) return;
        const payload = registerPayload.value;

        switch (toStep) {
            // Start
            case 6:
                if (payload.loginMethod === "email" && !isValidEmail(payload.email))
                    throw new Error("Your email address is invalid. Check for typos.");
                break;
            // Basics
            case 7:
                // Only check for password if the login method is email
                if (payload.loginMethod === "email") {
                    if (!payload.password || !payload.password.length)
                        throw new Error("The password is invalid. Please try again.");
                    if (!isValidPassword(payload.password))
                        throw new Error("Your password should contain a capital and lowercase letter, a number, a special character and should be atleast 8 characters long.");
                }
                if (!isValidUsername(payload.username, true))
                    throw new Error("This username is invalid or already taken. Please try another one.");
                break;
            case 9:
                if (registerPayload.value.description && registerPayload.value.description.length > 250)
                    throw new Error("Description is too long. Use a maximum of 250 characters.");
                break;
            // Confirmation
            case 11:
                if (!registerButtonLoading.value) {
                    registerButtonLoading.value = true;
                    if (!(await registerWithEmail())) return;
                    registerButtonLoading.value = false;
                } else throw new Error("Please wait a moment while we progress your registration.");
                break;
            // Verification - Verify
            case 13:
                if (!isValidRecoveryCode(recoveryCodeInput.value) || !recoveryCodeInput.value)
                    throw new Error("The recovery code is invalid. Make sure it is 6 digits long.");
                await useFetchVerifyEmailAccount(payload.email, recoveryCodeInput.value);
                break;
            // Login - Login with email
            case 14:
                const loginResponse: boolean = await loginWithEmail(emailInput.value, passwordInput.value);
                if (!loginResponse) return;
                break;
            // Login - 2FA
            case 15:
                return await loginWith2FA(emailInput.value, recoveryCodeInput.value);
            default:
                break;
        }

        loginProgressionStep.value = toStep;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Sets the file input for profile picture or banner.
 *
 * @param event The event triggered by the file input change.
 * @param type The type of file input (profilePicture or banner).
 */
function setFile(event: Event, type: string): void {
    try {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];

            // Check if the file is an image
            if (!file.type.startsWith("image/"))
                throw new Error(
                    "Invalid file type. Please select an image file like JPG or PNG."
                );

            if (type === "profilePicture") {
                profilePictureInput.value = file;
                registerPayload.value.avatar = createTicket();
            } else if (type === "banner") {
                bannerInput.value = file;
                registerPayload.value.banner = createTicket();
            }

            // No image selected, reset the input
        } else if (type === "profilePicture") {
            profilePictureInput.value = null;
            delete registerPayload.value.avatar;
        } else if (type === "banner") {
            bannerInput.value = null;
            delete registerPayload.value.banner;
        }
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

async function registerWithEmail(): Promise<boolean> {
    try {
        const payload = registerPayload.value;
        if (!isValidEmail(payload.email)) {
            throw new Error("Your email address is invalid. Check for typos.");
        } else if (!isValidUsername(payload.username, true))
            throw new Error(
                "This username is invalid or already taken. Please try another one."
            );
        if (payload.loginMethod === "email") {
            if (!payload.password || !payload.password.length)
                throw new Error("The password is invalid. Please try again.");
            if (!isValidPassword(payload.password))
                throw new Error(
                    "Your password should contain a capital and lowercase letter, a number, a special character and should be atleast 8 characters long."
                );
        }

        // Prepare payload
        const formData = new FormData();
        formData.append("registerPayload", JSON.stringify(payload));
        if (profilePictureInput.value)
            formData.append("profilePicture", profilePictureInput.value);
        if (bannerInput.value) formData.append("banner", bannerInput.value);

        // Cleanse dangling data
        if (payload.avatar && !formData.has("profilePicture")) delete payload.avatar;
        if (payload.banner && !formData.has("banner")) delete payload.banner;

        const response = await useFetchRegisterEmail(formData);
        userStore.setUser(response);

        return true;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
        return false;
    }
}

/**
 * Create an image preview URL for the profile picture or banner.
 *
 * @param type The type of image to create (profilePicture or banner).
 */
function createImg(type: "profilePicture" | "banner"): string {
    if (type === "profilePicture") {
        return profilePictureInput.value
            ? URL.createObjectURL(profilePictureInput.value)
            : "/icons/avatar.svg";
    } else
        return bannerInput.value
            ? URL.createObjectURL(bannerInput.value)
            : "/img/banner.png";
}

// Watchers

/**
 * Upload to session to save progression.
 */
watch(
    registerPayload,
    (newValue) => {
        userStore.setRegisterUser(newValue);
    },
    { deep: true }
);
</script>

<template>
    <div class="flex flex-col items-center w-[400px] h-[700px] bg-fill rounded-xl py-12 px-8 box-border">
        <div class="flex flex-col w-72">
            <section class="h-32 flex flex-col justify-between items-center mb-8">
                <NuxtImg src="/icons/logo.svg" height="45" width="170" alt="Rabbit Logo" />
                <h1 class="text-2xl font-semibold">
                    {{ pageMode === "login" ? "Log In" : "Sign Up" }}
                </h1>
            </section>
            <section class="flex flex-col gap-4">
                <!-- Login -->
                <template v-if="pageMode === 'login'">
                    <template v-if="loginProgressionStep === 0">
                        <form @submit.prevent="progressRegister(14)" class="flex flex-col gap-4">
                            <div class="relative flex items-center w-full">
                                <label for="email" v-if="!emailInput.length"
                                    class="absolute left-3 text-font-light pointer-events-none flex align-center gap-1 text-sm">
                                    Email<span class="text-orange-500">*</span>
                                </label>
                                <input type="email" v-model="emailInput" required id="email" name="email"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <div class="relative flex items-center w-full mb-[-10px]">
                                <label for="password" v-if="!passwordInput.length"
                                    class="absolute left-3 text-font-light pointer-events-none flex align-center gap-1 text-sm">
                                    Password<span class="text-orange-500">*</span>
                                </label>
                                <input type="password" v-model="passwordInput" required id="password" name="password"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <div class="flex flex-col items-end gap-8">
                                <button @click="loginProgressionStep = 1" title="Forgot password?"
                                    class="text-xs text-orange-500 hover:text-orange-600">
                                    Forgot password?
                                </button>
                                <Button label="Login" type="submit" title="Submit login" classname="w-full"></Button>
                            </div>
                            <div class="flex items-center w-full gap-1 justify-center">
                                <p class="text-xs text-gray-500">Still a Stray?</p>
                                <button type="button" @click="switchMode()" title="Sign up for an account"
                                    class="text-xs text-orange-500 hover:text-orange-600">
                                    Become a Hopper
                                </button>
                            </div>
                        </form>
                        <div class="flex items-center w-full gap-1 justify-center mt-2">
                            <hr class="w-2/5 border-gray-400" />
                            <p class="text-rg text-gray-400 w-20 text-center uppercase">
                                or
                            </p>
                            <hr class="w-2/5 border-gray-400" />
                        </div>
                        <button @click="openInPopup('/api/auth/google')" title="Login with Google"
                            class="flex items-center gap-2 justify-center w-full h-10 px-4 rounded border border-gray-600 hover:bg-fill-light mt-4">
                            <img src="/icons/google.svg" alt="Google Logo" class="w-5 h-5" />
                            <span class="text-sm text-gray-300">Continue with Google</span>
                        </button>
                    </template>
                    <!-- Forgot Password - Send -->
                    <template v-else-if="loginProgressionStep === 1">
                        <h2 class="text-lg">Forgot Password</h2>
                        <p class="text-sm text-gray-500">
                            Enter your email address to reset your password. You will
                            receive a 6-digit code required for the next step.
                        </p>
                        <form @submit.prevent="sendRestoreEmailAccount($event)" class="flex flex-col gap-4">
                            <div class="relative flex items-center w-full">
                                <label for="email" v-if="!emailInput.length"
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm">
                                    Email<span class="text-orange-500">*</span>
                                </label>
                                <input type="email" v-model="emailInput" required id="email" name="email"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <Button label="Send Reset Code" type="submit" classname="w-full"
                                title="Send reset code to this email"></Button>
                            <button @click="loginProgressionStep = 0" title="Cancel forgot password"
                                class="text-xs text-orange-500 hover:text-orange-600 w-full text-center">
                                Back to Login
                            </button>
                        </form>
                    </template>
                    <!-- Forgot Password - Verification -->
                    <template v-else-if="loginProgressionStep === 2">
                        <h2 class="text-lg">Recovery Email Sent</h2>
                        <p class="text-sm text-gray-500">
                            A recovery email has been sent to your email address. Submit
                            the 6-digit code to continue to the next step.
                        </p>
                        <form @submit.prevent="verifyRestoreEmailAccount($event)" class="flex flex-col gap-4">
                            <div class="relative flex items-center w-full">
                                <label v-if="
                                    recoveryCodeInput === null ||
                                    recoveryCodeInput.toString().trim() === ''
                                " class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm"
                                    for="recoveryCode">
                                    Recovery Code<span class="text-orange-500">*</span>
                                </label>
                                <input type="number" maxlength="6" minlength="6" min="0" max="999999"
                                    v-model="recoveryCodeInput" required id="recoveryCode" name="recoveryCode"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none no-spinner" />
                            </div>
                            <Button label="Verify Code" type="submit" classname="w-full"
                                title="Submit recovery code"></Button>
                            <button @click="loginProgressionStep = 0" title="Cancel forgot password"
                                class="text-xs text-orange-500 hover:text-orange-600 w-full text-center">
                                Cancel
                            </button>
                        </form>
                    </template>
                    <!-- Forgot Password - New Password -->
                    <template v-else-if="loginProgressionStep === 3">
                        <h2 class="text-lg">Set New Password</h2>
                        <p class="text-sm text-gray-500">Enter your new password.</p>
                        <form @submit.prevent="restoreEmailAccount($event)" class="flex flex-col gap-4">
                            <div class="relative flex items-center w-full">
                                <label for="newPassword" v-if="!newPasswordInput.length"
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm">
                                    New Password<span class="text-orange-500">*</span>
                                </label>
                                <input type="password" v-model="newPasswordInput" required id="newPassword"
                                    name="newPassword"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <div class="relative flex items-center w-full">
                                <label for="confirmPassword" v-if="!confirmPasswordInput.length"
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm">
                                    Confirm Password<span class="text-orange-500">*</span>
                                </label>
                                <input type="password" v-model="confirmPasswordInput" required id="confirmPassword"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <Button label="Set New Password" type="submit" classname="w-full"
                                title="Submit and update your password"></Button>
                            <button @click="loginProgressionStep = 0" title="Cancel forgot password"
                                class="text-xs text-orange-500 hover:text-orange-600 w-full text-center">
                                Cancel
                            </button>
                        </form>
                    </template>
                    <!-- Forgot Password Success -->
                    <template v-else-if="loginProgressionStep === 4">
                        <h2 class="text-lg">Success!</h2>
                        <p class="text-sm text-gray-500">
                            Your password has been reset successfully. You are
                            automatically logged in already, so click Continue to start
                            using the platform.
                        </p>
                        <NuxtLink to="/" title="Continue to the homepage"
                            class="flex justify-center items-center text-sm h-10 px-4 gap-2 rounded w-full mt-8 bg-brand hover:bg-brand-hover active:bg-brand-hover">
                            Continue</NuxtLink>
                    </template>
                    <template v-else-if="loginProgressionStep === 14">
                        <h2 class="text-lg">2-Factor Authentication</h2>
                        <p class="text-sm text-gray-500">Please verify the code sent to your inbox.</p>
                        <form @submit.prevent="progressRegister(15)" class="flex flex-col gap-4">
                            <div class="relative flex items-center w-full">
                                <label v-if="
                                    recoveryCodeInput === null ||
                                    recoveryCodeInput.toString().trim() === ''
                                " class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm"
                                    for="recoveryCode">
                                    Recovery Code<span class="text-orange-500">*</span>
                                </label>
                                <input type="number" maxlength="6" minlength="6" min="0" max="999999"
                                    v-model="recoveryCodeInput" required id="recoveryCode" name="recoveryCode"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none no-spinner" />
                            </div>
                            <Button label="Verify Code" type="submit" classname="w-full"
                                title="Submit 2FA code"></Button>
                        </form>
                    </template>
                </template>
                <!-- Register -->
                <template v-else>
                    <!-- Register - Start -->
                    <template v-if="loginProgressionStep === 5">
                        <h2 class="text-lg">Becoming a Hopper 101</h2>
                        <p class="text-sm text-gray-500">
                            Enter the world of Hoppers and Burrows. It will take no more
                            than a couple of minutes.
                        </p>
                        <form @submit.prevent="progressRegister(6)" class="flex flex-col gap-4 mt-4">
                            <div class="relative flex items-center w-full">
                                <label for="email" v-if="!registerPayload.email.length"
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm">
                                    Email<span class="text-orange-500">*</span>
                                </label>
                                <input type="email" v-model="registerPayload.email" required id="email" name="email"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <Button label="Continue" type="submit" classname="w-full mt-8"
                                title="Continue to the next step"></Button>
                            <div class="flex items-center w-full gap-1 justify-center">
                                <p class="text-xs text-gray-500">Already a Hopper?</p>
                                <button type="button" @click="switchMode()" title="Log in to your existing account"
                                    class="text-xs text-orange-500 hover:text-orange-600">
                                    Log In
                                </button>
                            </div>
                        </form>
                        <div class="flex items-center w-full gap-1 justify-center mt-2">
                            <hr class="w-2/5 border-gray-400" />
                            <p class="text-rg text-gray-400 w-20 text-center uppercase">
                                or
                            </p>
                            <hr class="w-2/5 border-gray-400" />
                        </div>
                        <button @click="openInPopup('/api/auth/google')" title="Register with Google"
                            class="flex items-center gap-2 justify-center w-full h-10 px-4 rounded border border-gray-600 hover:bg-fill-light mt-4">
                            <img src="/icons/google.svg" alt="Google Logo" class="w-5 h-5" />
                            <span class="text-sm text-gray-300">Continue with Google</span>
                        </button>
                    </template>
                    <!-- Register - Basics -->
                    <template v-else-if="loginProgressionStep === 6">
                        <h2 class="text-lg">Humble beginnings</h2>
                        <p class="text-sm text-gray-500">Let's start with the basics.</p>
                        <p class="text-sm text-gray-500">
                            Choose a nice and unique username. It should be between 2 and
                            20 characters. Accounts with usernames that are against the
                            <NuxtLink to="/" class="text-orange-500 hover:text-orange-600" target="_blank">terms
                            </NuxtLink>
                            will be removed.
                        </p>
                        <form @submit.prevent="progressRegister(7)" class="flex flex-col gap-4 mt-4">
                            <div class="relative flex items-center w-full">
                                <label for="username" v-if="!registerPayload.username.length"
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm">
                                    Username<span class="text-orange-500">*</span>
                                </label>
                                <input type="text" v-model="registerPayload.username" required id="username"
                                    name="username"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <div class="relative flex items-center w-full"
                                v-if="registerPayload.loginMethod === 'email'">
                                <label for="password" v-if="
                                    !registerPayload.password ||
                                    !registerPayload.password.length
                                "
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm">
                                    Password<span class="text-orange-500">*</span>
                                </label>
                                <input type="password" v-model="registerPayload.password" required id="password"
                                    name="password"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            </div>
                            <div class="flex items-center justify-between mt-8 gap-4">
                                <Button label="Go back" type="button" variant="outline" title="Go back to the beginning"
                                    @click="loginProgressionStep = 5" classname="w-1/2"></Button>
                                <Button label="Continue" type="submit" classname="w-1/2"
                                    title="Continue to setting a profile picture and banner"></Button>
                            </div>
                        </form>
                    </template>
                    <!-- Register - Images -->
                    <template v-else-if="loginProgressionStep === 7">
                        <h2 class="text-lg">Profile Picture & Banner</h2>
                        <p class="text-sm text-gray-500">
                            Alright, add some images next! Optional, but recommended. It
                            will make your profile stand out from the other Hoppers.
                        </p>
                        <p class="text-sm text-gray-500">
                            You can always add or change these later.
                        </p>
                        <form @submit.prevent="progressRegister(8)" class="flex flex-col gap-4 mt-4">
                            <label for="profilePicture" class="text-sm text-gray-500">Profile Picture</label>
                            <input type="file" id="profilePicture" accept="image/*" name="profilePicture"
                                @change="setFile($event, 'profilePicture')"
                                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            <label for="banner" class="text-sm text-gray-500">Banner</label>
                            <input type="file" id="banner" accept="image/*" name="banner"
                                @change="setFile($event, 'banner')"
                                class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none" />
                            <div class="flex items-center justify-between mt-8 gap-4">
                                <Button label="Go back" type="button" variant="outline" title="Go back to the basics"
                                    @click="loginProgressionStep = 6" classname="w-1/2"></Button>
                                <Button label="Continue" type="submit" classname="w-1/2"
                                    title="Continue to customizing your profile"></Button>
                            </div>
                        </form>
                    </template>
                    <!-- Register - Profile Information -->
                    <template v-else-if="loginProgressionStep === 8">
                        <h2 class="text-lg">Profile Information</h2>
                        <p class="text-sm text-gray-500">
                            Looking good so far. Try adding an introduction about yourself
                            to further customize your profile.
                        </p>
                        <p class="text-sm text-gray-500">
                            You can always change this later.
                        </p>
                        <form @submit.prevent="progressRegister(9)" class="flex flex-col gap-4 mt-4">
                            <div class="relative flex items-center w-full">
                                <label for="description" v-if="
                                    !registerPayload.description ||
                                    !registerPayload.description.length
                                "
                                    class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm top-3">
                                    Tell us about yourself
                                </label>
                                <textarea v-model="registerPayload.description" maxlength="250" id="description"
                                    name="description"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none resize-none h-32"></textarea>
                                <p
                                    class="text-xs text-orange-500 text-right absolute right-2 bottom-2 pointer-events-none">
                                    {{
                                        registerPayload.description
                                            ? registerPayload.description.length
                                            : 0
                                    }}/250
                                </p>
                            </div>
                            <div class="flex items-center justify-between mt-8 gap-4">
                                <Button label="Go back" type="button" variant="outline" title="Go back to the images"
                                    @click="loginProgressionStep = 7" classname="w-1/2"></Button>
                                <Button label="Continue" type="submit" classname="w-1/2"
                                    title="Continue to your Buddies"></Button>
                            </div>
                        </form>
                    </template>
                    <!-- Register - Buddies -->
                    <template v-else-if="loginProgressionStep === 9">
                        <h2 class="text-lg">Buddies</h2>
                        <p class="text-sm text-gray-500">
                            Almost there! You can add some Buddies to your profile. They
                            are your friends that you can interact with.
                        </p>
                        <p class="text-sm text-gray-500">
                            You can add them by searching for their username if they
                            already have an account.
                        </p>
                        <p class="text-sm text-gray-500">
                            You can always manage your Buddies later.
                        </p>
                        <form @submit.prevent="progressRegister(10)" class="flex flex-col gap-4 mt-4">
                            <div class="flex items-center justify-between mt-8 gap-4">
                                <Button label="Go back" type="button" variant="outline"
                                    title="Go back to the profile information" @click="loginProgressionStep = 8"
                                    classname="w-1/2"></Button>
                                <Button label="Continue" type="submit" classname="w-1/2"
                                    title="Continue to confirmation"></Button>
                            </div>
                        </form>
                    </template>
                    <!-- Register - Confirmation -->
                    <template v-else-if="loginProgressionStep === 10">
                        <h2 class="text-lg">Confirmation</h2>
                        <p class="text-sm text-gray-500">
                            Okay, this is you! Everything OK or would you like to change
                            something?
                        </p>
                        <p class="text-sm text-gray-500">
                            You can always go back through the steps, and don't worry, we
                            will not save anything until you click the register button.
                        </p>
                        <div class="flex flex-col bg-fill-hover rounded">
                            <NuxtImg alt="Banner" :src="createImg('banner')"
                                class="w-full h-20 object-cover rounded-t" />
                            <div class="flex items-center gap-4 -mt-4 ml-2">
                                <NuxtImg alt="Avatar" :src="createImg('profilePicture')"
                                    class="w-20 aspect-square object-cover border-8 border-fill-hover rounded-full" />
                                <h3 class="text-lg font-semibold">
                                    h/{{ registerPayload.username }}
                                </h3>
                            </div>
                            <p class="text-gray-500 ml-4 mt-2 mb-4">
                                {{ registerPayload.description }}
                            </p>
                            <p class="text-gray-500 ml-4 mt-2 mb-4" v-if="registerPayload.buddies?.length">
                                {{ registerPayload.buddies.length }} buddies
                            </p>
                        </div>
                        <form @submit.prevent="progressRegister(11)" class="flex flex-col gap-4 mt-4">
                            <div class="flex items-center justify-between gap-4">
                                <Button label="Go back" type="button" variant="outline"
                                    title="Go back to change something" @click="loginProgressionStep = 9"
                                    classname="w-1/2"></Button>
                                <Button label="Register" type="submit" title="Register and create your account"
                                    :disabled="registerButtonLoading"
                                    classname="w-1/2 font-semibold bg-brand-alt hover:bg-brand-alt-hover"></Button>
                            </div>
                        </form>
                    </template>
                    <!-- Register - Success -->
                    <template v-else-if="loginProgressionStep === 11">
                        <h2 class="text-lg">Success!</h2>
                        <p class="text-sm text-gray-500">
                            A confirmation email has been sent to your email address. You
                            can verify your account right now, or do it later in the Security settings.
                        </p>
                        <p class="text-sm text-gray-500">
                            Keep in mind that the platform will be limited until you
                            verify your email.
                        </p>
                        <form @submit.prevent="progressRegister(12)" class="flex flex-col gap-4 mt-4">
                            <div class="flex items-center justify-between mt-8 gap-4">
                                <NuxtLink to="/" title="Confirm later, and start using the platform"
                                    class="flex justify-center items-center text-sm h-10 px-4 gap-2 rounded w-1/2 bg-transparent hover:border-orange-600 active:border-orange-700 border border-orange-500 text-orange-500">
                                    Do it later</NuxtLink>
                                <Button label="Verify now" type="submit" classname="w-1/2"
                                    title="Verify your account now"></Button>
                            </div>
                        </form>
                    </template>
                    <!-- Register - Verification -->
                    <template v-else-if="loginProgressionStep === 12">
                        <h2 class="text-lg">Account Verification</h2>
                        <p class="text-sm text-gray-500">
                            To use the account to its full extent, please verify your
                            account.
                        </p>
                        <p class="text-sm text-gray-500">
                            Check your mailbox. This is the last step, we promise!
                        </p>
                        <form @submit.prevent="progressRegister(13)" class="flex flex-col gap-4">
                            <div class="relative flex items-center w-full">
                                <label v-if="
                                    recoveryCodeInput === null ||
                                    recoveryCodeInput.toString().trim() === ''
                                " class="absolute left-2 text-gray-500 pointer-events-none flex align-center gap-1 text-sm"
                                    for="recoveryCode">
                                    Recovery Code<span class="text-orange-500">*</span>
                                </label>
                                <input type="number" maxlength="6" minlength="6" min="0" max="999999"
                                    v-model="recoveryCodeInput" required id="recoveryCode" name="recoveryCode"
                                    class="w-full border border-gray-300 rounded p-2 px-3 text-font bg-fill-light border-none no-spinner" />
                            </div>
                            <Button label="Verify Code" type="submit" classname="w-full"
                                title="Submit verification code"></Button>
                            <NuxtLink to="/" class="text-xs text-orange-500 hover:text-orange-600 w-full text-center">
                                Cancel</NuxtLink>
                        </form>
                    </template>
                    <!-- Register - Verification Success -->
                    <template v-else-if="loginProgressionStep === 13">
                        <h2 class="text-lg">Success!</h2>
                        <p class="text-sm text-gray-500">
                            Your account has been verified successfully.
                        </p>
                        <p class="text-sm text-gray-500 mb-8">
                            Your Hopper account is now ready, and you can use the platform
                            to its full extent. Good luck on your adventures!
                        </p>
                        <NuxtLink to="/"
                            class="flex justify-center items-center text-sm h-10 px-4 gap-2 rounded w-full bg-brand-alt hover:bg-brand-alt-hover">
                            Hop In</NuxtLink>
                    </template>
                </template>
            </section>
        </div>
    </div>
</template>
