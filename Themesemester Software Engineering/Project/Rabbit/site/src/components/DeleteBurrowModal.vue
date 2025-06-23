<script lang="ts" setup>
import { ButtonComponent as Button } from "#components";
import { useDeleteBurrow } from "~/utils/fetch/admin/deleteBurrow";
import { ToastTypes, type ToastItem } from "~/assets/customTypes";

const { $event } = useNuxtApp();

/**
 * Modal component to confirm deletion of a burrow.
 * @param onClose - Function to close the modal
 * @param onDelete - Callback function to execute after successful deletion
 * @param burrowName - Name of the burrow to delete
 */
const props = withDefaults(
    defineProps<{
        onClose: () => void;
        onDelete: () => void;
        burrowName: string;
    }>(),
    {},
);

const { onClose, onDelete, burrowName } = props;

/**
 * Deletes the specified burrow and emits a success or error toast notification.
 */
async function processDeleteBurrow(): Promise<void> {
    try {
        await useDeleteBurrow(burrowName);

        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: `Burrow has been deleted successfully.`,
            duration: 3,
        } as ToastItem);

        onClose();
        onDelete();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Failed to ban hopper. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}
</script>

<template>
    <div class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-75" @click.self="onClose">
        <div class="bg-fill p-4 rounded-lg shadow-xl w-full max-w-md flex flex-col m-4 h-min" role="dialog"
            aria-modal="true">
            <div class="flex justify-between items-start mb-2">
                <h2 class="text-sm font-bold text-white truncate pr-2">
                    Confirm Delete: {{ burrowName }}
                </h2>
                <Button variant="ghost" color="fill" size="medium" classname="size-6 p-0" aria-label="Close ban modal"
                    @click="onClose">
                    <i class="fi fi-sr-cross-small size-5 text-gray-400 hover:text-white"></i>
                </Button>
            </div>

            <p class="text-xs text-gray-500 truncate mb-4">
                Are you sure you want to delete this burrow?
            </p>

            <div class="flex justify-end gap-2 mt-auto pt-2">
                <Button size="medium" variant="outline" color="fill" label="Cancel" classname="h-8 px-3"
                    @click="onClose" />
                <Button size="medium" color="fill" label="Delete"
                    classname="h-8 px-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
                    @click="processDeleteBurrow()" />
            </div>
        </div>
    </div>
</template>