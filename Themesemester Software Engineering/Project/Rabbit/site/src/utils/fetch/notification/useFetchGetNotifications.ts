import type { NotificationItem } from "~/assets/customTypes";

export const useFetchGetNotifications = async (hopperId: number): Promise<Array<NotificationItem>> => {
    try {
        return await $fetch("/api/notification", {
            method: "GET",
            query: {
                hopperId,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}