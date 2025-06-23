<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { fetchApi } from '@/utils/fetch';
import { BsnValidationMessage } from '@/assets/enums';

const bsn: Ref<string> = ref('');
const message = ref<string | null>(null);
const bsnInput = ref<HTMLInputElement | null>(null);
const locked = ref<boolean>(false);

async function submit() {
    if (locked.value) return;

    const response: keyof typeof BsnValidationMessage = await fetchApi(`/bsn/validate/${bsn.value}`);
    message.value = BsnValidationMessage[response];

    if (bsnInput.value) {
        bsnInput.value.classList.remove('success', 'error');
        bsnInput.value.focus();
        bsnInput.value.classList.add(response === "VALID" ? 'success' : 'error');

        if (response !== "VALID") locked.value = true;
    }
}
</script>

<template>
    <main>
        <div class="form-wrapper">
            <form @submit.prevent="submit" class="flex-col">
                <label for="bsn">BSN*</label>
                <input ref="bsnInput" type="text" id="bsn" name="bsn" required v-model="bsn" @input="locked = false" />
                <p v-if="message">{{ message }}</p>
                <button type="submit">Validate</button>
            </form>
        </div>
    </main>
</template>

<style scoped>
.form-wrapper {
    width: 350px;
    height: 300px;
}

form {
    box-sizing: border-box;
    padding: 20px;
    border-radius: var(--border-radius-low);
    background-color: var(--fill);
    height: 100%;
}

input {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    margin: 5px 0;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
}

button {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    margin: 5px 0;
    border-radius: var(--border-radius-low);
    border: 1px solid var(--border);
    background-color: var(--accent);
    color: var(--fill);
    margin-top: auto;
}
</style>
