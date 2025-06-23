<script lang="ts" setup>
import type { IntegrationItem } from '~/assets/customTypes';
import { useFetchIntegrations, useFetchTestIntegration, useFetchAddIntegration } from '~/utils/data';

// Reactive Data
const integrations: Ref<Array<IntegrationItem>> = ref([]);
const isFetched: Ref<boolean> = ref(false);
const result: Ref<string> = ref("");
const overlay: Ref<boolean> = ref(false);
const name: Ref<string> = ref("");
const baseUrl: Ref<string> = ref("");
const description: Ref<string> = ref("");
const key: Ref<string> = ref("");

// Lifecycle Hooks
onMounted(() => {
    fetchIntegrations();
});

// Methods

/**
 * Fetches the integrations from the server.
 */
async function fetchIntegrations(): Promise<void> {
    try {
        const response: Array<IntegrationItem> | number = await useFetchIntegrations();
        if (typeof response === "number") return window.alert("Error fetching integrations. Please try again later.");
        integrations.value = response;
        isFetched.value = true;
    } catch (error) {
        window.alert("Error fetching integrations. Please try again later.");
    }
}

/**
 * Tests the integration.
 */
async function testIntegration(id: number): Promise<void> {
    try {
        // Test the integration
        result.value = "Testing integration...";
        const response: any | number = await useFetchTestIntegration(id);
        if (typeof response === "number") {
            result.value = "";
            return window.alert("Error testing integration. Please try again later.");
        }
        result.value = response;
        window.alert("Integration test successful.");
    } catch (error) {
        result.value = "";
        window.alert("Error testing integration. Please try again later.");
    }
}

/**
 * Submits the integration.
 */
async function submitIntegration(): Promise<void> {
    try {
        // Submit the integration
        if (!isValidUrl(baseUrl.value)) return window.alert("Invalid URL. Please enter a valid URL.");

        overlay.value = false;
        const response: any | number = await useFetchAddIntegration({
            name: name.value,
            baseUrl: baseUrl.value,
            description: description.value,
            key: key.value
        });
        if (response !== 200) return window.alert("Error adding integration. Please try again later.");
        window.alert("Integration added successfully.");
        await fetchIntegrations();
    } catch (error) {
        window.alert("Error adding integration. Please try again later.");
    }
}

/**
 * Check if a string is a valid URL.
 * @param url The URL to validate.
 * @returns If the URL is valid or not.
 */
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}
</script>

<template>
    <span class="overlay" v-if="overlay" @click="overlay = false"></span>
    <div class="overlay-content" v-if="overlay">
        <h3>Add new integration</h3>
        <form @submit.prevent="submitIntegration" class="flex-col">
            <input type="text" placeholder="Name" v-model="name" required>
            <input type="text" placeholder="Base URL" v-model="baseUrl" required>
            <input type="text" placeholder="Description" v-model="description" required>
            <input type="text" placeholder="Auth Key" v-model="key">
            <button type="submit">Submit</button>
        </form>
    </div>
    <section class="settings-page">
        <div class="header flex">
            <div class="flex-col">
                <h3>Integrations</h3>
                <p class="header-text">Connect other services to your account.</p>
            </div>
            <button @click="overlay = true">Add Integration</button>
        </div>
        <div>
            <p v-if="integrations.length">Current integrations ({{ integrations.length }}):</p>
            <small v-else-if="isFetched">You do not have any active integrations.</small>
            <small v-else>Loading integrations...</small>

            <div v-for="integration in integrations" class="flex integration" :key="integration.id">
                <div class="flex-col">
                    <strong>{{ integration.name }}</strong>
                    <p>{{ integration.base_url }}</p>
                    <small>{{ integration.description }}</small>
                </div>
                <button @click="testIntegration(integration.id)">Test</button>
            </div>
        </div>
        <div v-if="result">
            <strong>Test Result:</strong>
            <p>{{ result }}</p>
        </div>
    </section>
</template>

<style scoped>
.integration {
    padding: 10px;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    margin-top: 10px;
    justify-content: space-between;
}

.header {
    justify-content: space-between;
    margin-bottom: 20px;
}

button {
    padding: 5px;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--fill);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.overlay-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background-color: var(--fill);
    border-radius: var(--border-radius-low);
    z-index: 2;
    width: 300px;
}

input {
    box-sizing: border-box;
    padding: 5px;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    width: 100%;
    margin: 10px 0;
}
</style>