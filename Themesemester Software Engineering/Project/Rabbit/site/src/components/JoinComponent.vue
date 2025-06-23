<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ButtonComponent as Button } from "#components";
import { useFetchStatusBurrow } from "~/utils/fetch/burrow/useFetchSatusBurrow";
import { useFetchBurrowMemberStatus } from "~/utils/fetch/burrow/useFetchBurrowMemberStatus";

const props = defineProps<{
    burrowId: number;
    hopperId: number;
}>();

const emit = defineEmits<{
    (e: "update:member", value: boolean): void;
}>();

const isMember = ref(false);
const isLoading = ref(false);
const { $event } = useNuxtApp();

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

onMounted(async () => {
    isMember.value = await useFetchBurrowMemberStatus(
        props.burrowId,
        props.hopperId,
    );
});

async function handleJoinClick() {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
        await useFetchStatusBurrow(
            props.burrowId,
            props.hopperId,
            !isMember.value,
        );
        isMember.value = !isMember.value;
        emit("update:member", isMember.value);
    } catch (error) {
        toast(
            (error as { message?: string })?.message ||
            "Failed to update burrow membership. Please try again.",
            "danger",
        );
    } finally {
        isLoading.value = false;
    }
}
</script>

<template><Button :label="isMember ? 'Joined' : 'Join'" class="!rounded-full" :classname="isMember
    ? 'px-4 font-semibold !bg-fill hover:!bg-fill-hover'
    : 'px-4 font-semibold bg-brand hover:bg-brand-hover'
    " variant="primary" :color="isMember ? 'fill' : 'orange'" size="medium" :disabled="isLoading"
    @click="handleJoinClick" /></template>
