<script setup lang="ts">
import type { ToastItem, ToastTypes } from '~/assets/customTypes';
const { $listen } = useNuxtApp();

// Reactive Data
const toastItems: Ref<Array<ToastItem>> = ref([]);

// Mount Listeners
$listen("emit-toast", (event: any) => addMessage(event as ToastItem));

// Methods

/**
 * Add a toast message to the list of toast messages.
 * 
 * @param toastEvent The toast message to add.
 */
function addMessage(toastEvent: ToastItem): void {
    const payload: ToastItem = {
        id: toastEvent.id,
        message: toastEvent.message,
        type: toastEvent.type,
        duration: toastEvent.duration
    }
    toastItems.value.push(payload);

    setTimeout(() => {
        try {
            const toastItem = document.getElementById(`toast-item-${payload.id}`) as HTMLDivElement;
            toastItem.classList.add("toast-open");
        } catch (error: any) { }
    }, 100);

    setTimeout(() => {
        closeMessage(payload.id);
    }, toastEvent.duration * 1000);
}

/**
 * Close the toast message the user clicked on.
 * Can also be done programmatically by passing the id of the toast.
 * 
 * @param id The id of the toast to close.
 */
function closeMessage(id: string | MouseEvent): void {
    let toastItem: HTMLDivElement;
    if (typeof id === "object") {
        toastItem = (id.target as HTMLElement).parentElement as HTMLDivElement;
    } else {
        const toastItemFetch = document.getElementById(`toast-item-${id}`) as HTMLDivElement | null;
        if (!toastItemFetch) return;
        toastItem = toastItemFetch;
    }

    toastItem.classList.remove("toast-open");
    const toastId = typeof id === "object" ? toastItem.id.split("-")[2] : id;
    setTimeout(() => {
        toastItems.value = toastItems.value.filter((item) => item.id !== toastId);
    }, 500);
}

/**
 * Get the Tailwind color class for the toast message based on its type.
 * 
 * @param type The type of the toast message.
 * @returns The Tailwind color class for the toast message.
 */
function getColorClass(type: keyof typeof ToastTypes): string {
    switch (type) {
        case "success":
            return "bg-green-400";
        case "warning":
            return "bg-orange-400";
        case "danger":
            return "bg-red-400";
        case "info":
        default:
            return "bg-blue-400";
    }
}
</script>

<template>
<Teleport to="body">
    <div class="flex flex-col fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] gap-2 z-50">
        <div v-for="item in toastItems" :id="`toast-item-${item.id}`"
            class="flex bg-fill w-full min-h-10 items-stretch border rounded hover:bg-fill-light border-fill-active gap-3 relative select-none cursor-pointer toast-item"
            :key="item.id">
            <span class="w-1 rounded-tl rounded-bl" :class="`${getColorClass(item.type)}`"></span>
            <div class="flex toast-item-content box-border justify-between w-full">
                <p class="text-white select-none" style="line-height: 28px;">{{ item.message }}</p>
                <NuxtImg class="icon select-none" width="15" height="15" src="/icons/plus.svg" loading="lazy"
                    alt="Icon" />
            </div>
            <span class="click-item" @click="closeMessage($event)"></span>
        </div>
    </div>
</Teleport>
</template>

<style scoped>
.toast-item {
    opacity: 0;
    transition: opacity 0.5s, transform 0.5s, background-color 0.2s;
    transform: translateY(100%);
    pointer-events: none;
    user-select: none;
}

.toast-open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: unset;
    user-select: unset;
}

.toast-item-content {
    padding: 5px 15px 5px 5px;
}

.toast-item .icon {
    opacity: 0;
    transition: opacity 0.2s;
    transform: rotate(45deg);
}

.toast-item:hover .icon {
    opacity: 1;
}
</style>