<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { ToastTypes, type ToastItem } from '~/assets/customTypes';
import { formatNumber } from '~/utils/format';

const props = withDefaults(defineProps<{
    id: number;
    type: 'post' | 'comment';
    praise?: number;
    upvotes?: number;
}>(), {
    praise: 0,
    upvotes: 0,
});
const emit = defineEmits<{
    (e: 'refresh'): void;
}>();

const { $event } = useNuxtApp();
const userStore = useUserStore();
const userId = userStore.user.id;

const localPraise = ref<number | null>(null);
const localUpvotes = ref<number | null>(null);

onMounted(() => {
    localPraise.value = props.praise;
    localUpvotes.value = props.upvotes;
});

const effectivePraise = computed(() => localPraise.value ?? props.praise);
const effectiveUpvotes = computed(() => localUpvotes.value ?? props.upvotes);

async function updatePraise(newValue: -1 | 0 | 1) {
    if (!userId) {
        $event("emit-toast", {
            id: Math.random().toString(36),
            type: "warning",
            message: "You must be logged in to vote.",
            duration: 3,
        });
        return;
    }

    const current = effectivePraise.value;
    const nextValue = current === newValue ? 0 : newValue;

    let updatedUpvotes = effectiveUpvotes.value;

    if (current === 1) updatedUpvotes--;
    if (current === -1) updatedUpvotes++;
    if (nextValue === 1) updatedUpvotes++;
    if (nextValue === -1) updatedUpvotes--;

    localPraise.value = nextValue;
    localUpvotes.value = updatedUpvotes;

    try {
        await $fetch(`/api/praise/${props.type}/${props.id}/${userId}`, {
            method: "PUT",
            body: { value: nextValue },
        });
        emit("refresh");
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

const upvote = () => updatePraise(1);
const downvote = () => updatePraise(-1);
</script>

<template>
    <div class="flex items-center gap-2 rounded-3xl bg-fill-light">
        <IconButton variant="primary" color="fill" size="medium" rounded icon-path="/icons/up.svg"
            :class="{ '!bg-brand-alt': effectivePraise === 1 }" @click="upvote">
            <i class="fi fi-sr-up size-3.5"></i>
        </IconButton>

        <p class="text-xs font-semibold">
            {{ formatNumber(effectiveUpvotes) }}
        </p>

        <IconButton variant="primary" color="fill" size="medium" rounded icon-path="/icons/down.svg"
            :class="{ '!bg-brand-negative': effectivePraise === -1 }" @click="downvote">
            <i class="fi fi-sr-down size-3.5"></i>
        </IconButton>
    </div>
</template>