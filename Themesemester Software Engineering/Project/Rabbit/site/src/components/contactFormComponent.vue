<script lang="ts" setup>
import {
    ButtonComponent as Button,
    InputComponent as Input,
    TextareaComponent as Textarea,
} from "#components";
import { useFetchSupportEmail } from "~/utils/fetch/burrow/useFetchSuppertEmail";
const { $event } = useNuxtApp();
const title = ref("");
const description = ref("");

const props = withDefaults(
    defineProps<{
        open: boolean;
        emails: string[];
        emailUser?: string;
        hopperId?: number;
        hopperName?: string;
        burrowName?: string;
    }>(),
    {
        emailUser: "",
        hopperId: 0,
        hopperName: "",
        burrowName: "",
    },
);

const emit = defineEmits<{
    (e: "close"): void;
}>();

/**
 * Create an toast message
 * @param message - The message to display in the toast.
 * @param type - The type of toast message, can be "success", "info", "warning", or "danger".
 * @param duration - The duration in seconds for which the toast will be displayed. Default is 5 seconds.
 */
function toast(
    message: string,
    type: "success" | "info" | "warning" | "danger" = "info",
    duration = 5,
) {
    $event("emit-toast", {
        id: createTicket(),
        message,
        type,
        duration,
    });
}
/**
 * Checks if the title and description fields are filled and within the character limits.
 * @returns {boolean} Returns true if the fields are valid, otherwise false.
 * @description This function validates the title and description fields to ensure they are not empty and do not exceed the character limits.
 */
function mailCheck(): boolean {
    if (!title.value || !description.value) {
        toast("Please fill in all fields.", "warning");
        return false;
    }
    if (title.value.length > 100) {
        toast("Title must be less than 100 characters.", "warning");
        return false;
    }
    if (description.value.length > 1000) {
        toast("Message must be less than 1000 characters.", "warning");
        return false;
    }
    return true;
}
/**
 * Sends an email to the keepers of the burrow and an confirmation email to the user.
 * @returns {Promise<void>}
 * @throws {Error} If the email fails to send.
 * @description This function validates the input fields, sends an email to the keepers of the burrow,
 */
async function sendMail() {
    if (!mailCheck()) return;
    try {
        await useFetchSupportEmail(
            props.emails.toString(),
            props.emailUser,
            props.hopperId,
            props.hopperName,
            props.burrowName,
            title.value,
            description.value,
        );
        toast("Email sent successfully!", "success");
        emit("close");
        title.value = "";
        description.value = "";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const msg =
            error?.data?.message ||
            error?.message ||
            "An error occurred while sending the email.";
        toast(msg, "danger");
    }
}
</script>

<template>
    <div
        v-if="props.open"
        class="fixed inset-0 z-15 flex items-center justify-center bg-black bg-opacity-60 overflow-scroll"
    >
        <div
            class="w-full max-w-3xl rounded-xl bg-fill px-6 py-4 text-font shadow-xl relative max-h-[calc(100vh-10rem)] overflow-auto"
        >
            <button
                class="absolute top-4 right-4 text-2xl text-font hover:text-red-400"
                @click="emit('close')"
            >
                &times;
            </button>
            <form class="flex flex-col mt-8">
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl font-semibold">
                        Contact the Keepers
                    </h1>
                    <div class="text-font-light mb-2 text-sm">
                        This form will send an email to the Keepers of the
                        Burrow. Please provide a clear title and message. Be
                        aware to check your email for a response, as it may take
                        some time for the Keepers to reply.
                    </div>
                </div>
                <Input
                    v-model="title"
                    label="Title"
                    required
                    fill
                    class="mb-4"
                    :max-length="100"
                />
                <Textarea
                    v-model="description"
                    label="Message"
                    required
                    fill
                    rich-text
                    :max-length="1000"
                />
                <Button label="Send Email" class="mt-4" @click="sendMail()" />
            </form>
        </div>
    </div>
</template>
