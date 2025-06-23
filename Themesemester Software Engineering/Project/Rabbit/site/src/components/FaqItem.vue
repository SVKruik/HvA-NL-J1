<script setup lang="ts">
defineProps<{
    question: string;
    answer: string;
}>();
</script>

<template>
    <details class="group bg-fill-light rounded-lg shadow p-4 mb-4">
        <summary
            class="cursor-pointer text-font font-semibold group-hover:text-brand transition text-lg"
        >
            {{ question }}
        </summary>
        <div class="text-gray-300 mt-2 ml-2">
            <div>{{ answer }}</div>
        </div>
    </details>
</template>
