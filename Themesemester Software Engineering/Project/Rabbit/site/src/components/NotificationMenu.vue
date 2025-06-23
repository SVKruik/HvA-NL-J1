<script lang="ts" setup>
import { NotificationTypes, type NotificationItem, type ToastItem } from '~/assets/customTypes';
const { $event } = useNuxtApp();
import { ToastTypes } from "~/assets/customTypes";
import { useFetchDeleteNotification } from '~/utils/fetch/notification/useFetchDeleteNotification';
import { useFetchReadNotification } from '~/utils/fetch/notification/useFetchReadNotification';
import { ButtonComponent as Button } from '#components';
const userStore = useUserStore();

// Props
const props = defineProps({
    notificationStack: {
        type: Array as () => Array<NotificationItem>,
        required: true,
    }
});

// Methods

/**
 * Get the message for a specific notification type.
 * @param type The type of notification to get the message for.
 * @returns The message corresponding to the notification type.
 */
function getMessage(type: NotificationTypes): string {
    switch (type) {
        case NotificationTypes.buddyAccepted:
            return "accepted your Buddy invitation! You are now friends.";
        case NotificationTypes.buddyDeclined:
            return "declined your Buddy invitation.";
        case NotificationTypes.buddyNew:
            return "sent you a new Buddy invitation. Manage it here.";
        case NotificationTypes.postComment:
            return "commented under your post.";
        case NotificationTypes.postPraise:
            return "gave your post a Praise!";
        case NotificationTypes.commentReply:
            return "replied to one of your comments.";
        default:
            return "";
    }
}

/**
 * Read a notification and mark it as read.
 * @param notification The notification item to read.
 */
async function readNotification(notification: NotificationItem): Promise<void> {
    try {
        if (notification.is_read) return;
        await useFetchReadNotification(userStore.user.id, notification.ticket);
        notification.is_read = true;
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}

/**
 * Delete a notification completely.
 * @param notification The notification item to delete.
 */
async function deleteNotification(event: MouseEvent, notification: NotificationItem): Promise<void> {
    try {
        event.preventDefault();
        await useFetchDeleteNotification(userStore.user.id, notification.ticket);
        props.notificationStack.splice(props.notificationStack.indexOf(notification), 1);
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
<div
    class="absolute bg-fill-light w-[450px] h-[200px] rounded-lg top-12 right-0 z-20 flex flex-col gap-2 shadow-xl disable-notification-close border border-font-light box-border p-2">
    <h1 class="text-start text-base font-bold disable-notification-close">Notification Center</h1>
    <div class="flex flex-col gap-2 disable-notification-close" v-if="notificationStack.length">
        <NuxtLink v-for="(notification, index) in notificationStack" :key="index" :to="notification.url"
            class="flex items-center gap-2 rounded-lg box-border p-1 hover:bg-fill cursor-pointer"
            @click="readNotification(notification)" title="Click to follow the notification link.">
            <span class="w-1 h-full rounded-l-lg" :class="{ 'bg-brand': !notification.is_read }"></span>
            <img :src="getFilePath(notification.data.avatar, notification.data.avatar_type)"
                class="w-10 h-10 rounded-full bg-cover" />
            <p class="text-wrap text-start w-[350px]">Hopper <strong>{{ notification.data.username }}</strong>
                {{ getMessage(notification.type) }}</p>
            <Button variant="ghost" @click.stop="deleteNotification($event, notification)" title="Delete Notification"
                classname="h-6 w-6 !p-0">
                <i class="fi fi-sr-plus size-3.5 rotate-45 text-red-500 -mr-[2px]" />
            </Button>
        </NuxtLink>
    </div>
    <div v-else class="text-center text-font-light m-auto">You are all caught up!</div>
</div>
</template>