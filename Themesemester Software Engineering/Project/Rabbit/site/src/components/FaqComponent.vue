<script setup lang="ts">
import { ref, computed } from "vue";
import FaqItem from "~/components/FaqItem.vue";

const search = ref("");
const faqs = [
    {
        question: "How do I reset my password?",
        title: "Resetting your password",
        answer: "Go to your account settings and click 'Reset Password'.",
    },
    {
        question: "How can I contact a Keeper directly?",
        title: "Contacting a Keeper",
        answer: "Use this form or check the community page for Keeper contact info.",
    },
    {
        question: "Where can I find the rules?",
        title: "Finding the rules",
        answer: "Rules are listed on the About page and in each Burrow.",
    },
];

const filteredFaqs = computed(() =>
    faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(search.value.toLowerCase()) ||
            faq.title.toLowerCase().includes(search.value.toLowerCase()) ||
            faq.answer.toLowerCase().includes(search.value.toLowerCase()),
    ),
);
</script>

<template>
    <section>
        <h2 class="text-2xl font-bold mb-4 text-white">
            Frequently Asked Questions
        </h2>
        <div class="mb-4">
            <InputComponent
                v-model="search"
                label="Search FAQ"
                icon
                fill
                size="medium"
                color="Ebony Clay"
            />
        </div>
        <div>
            <FaqItem
                v-for="faq in filteredFaqs"
                :key="faq.question"
                :question="faq.question"
                :title="faq.title"
                :answer="faq.answer"
            />
            <div v-if="filteredFaqs.length === 0" class="text-gray-400 mt-4">
                No FAQ items found.
            </div>
        </div>
    </section>
</template>
