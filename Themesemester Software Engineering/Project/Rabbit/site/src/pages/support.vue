<script setup lang="ts">
import { ref } from "vue";
import {
    TextareaComponent as Textarea,
    ButtonComponent as Button,
} from "#components";
import FaqComponent from "~/components/FaqComponent.vue";
import { useFetchSupportEmail } from "~/utils/fetch/support/useFetchSupportEmail";
import { ToastTypes, type ToastItem } from "~/assets/customTypes";

const userStore = useUserStore();
const { $event } = useNuxtApp();

// Display toast function
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
const categories = [
    "General Question",
    "Technical Issue",
    "Account/Billing",
    "Feedback",
    "Ban Appeal",
    "Report User",
    "Content Removal Request",
    "Privacy/Data Request",
    "Other",
];
const selectedCategory = ref(categories[0]);
const description = ref("");

/**
 * Submits the support request with the selected category and description.
 */
async function submitSupportReqquest() {
    if (selectedCategory.value === "") {
        toast("Please select a support category.", "warning");
        return;
    }
    if (description.value === "") {
        toast("Please provide a description of your issue.", "warning");
        return;
    }
    try {
        await useFetchSupportEmail(
            userStore.user.email,
            userStore.user.id,
            userStore.user.username,
            selectedCategory.value,
            description.value,
        );
        toast("Support request submitted successfully!", "success");
        selectedCategory.value = categories[0];
        description.value = "";
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
</script>

<template>
    <div class="max-w-2xl mx-auto py-12 px-4">
        <h1 class="text-3xl font-bold mb-8 text-white">Contact Support</h1>
        <p class="text-gray-300 mb-6">
            If you have any questions or need assistance, please fill out the
            form below. Our support team will get back to you as soon as
            possible. However, please look first at the FAQ section below before
            submitting a request, as your question may already be answered
            there.
        </p>
        <h2 class="text-xl font-semibold mb-4 text-white">
            Submit a Support Request
        </h2>
        <div>
            <label for="support-category" class="block mb-2 text-font font-semibold text-sm">
                Support Category
            </label>
            <div class="relative">
                <select id="support-category" v-model="selectedCategory"
                    class="w-full p-4 pr-10 rounded-lg bg-fill-light text-font border border-border focus:outline-none focus:ring-2 focus:ring-brand transition duration-150">
                    <option v-for="cat in categories" :key="cat" :value="cat">
                        {{ cat }}
                    </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-font-light">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="mt-4">
            <Textarea v-model="description" label="Description" :richText="true" :fill="true" :maxLength="1000" />
        </div>
        <Button label="Send" size="large" variant="primary" @click="submitSupportReqquest()" />
        <div class="mt-8">
            <FaqComponent />
        </div>
    </div>
</template>
