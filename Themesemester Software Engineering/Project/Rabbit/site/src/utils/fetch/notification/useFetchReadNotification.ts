export const useFetchReadNotification = async (hopperId: number, notificationTicket: string): Promise<boolean> => {
    try {
        return await $fetch("/api/notification/read", {
            method: "PATCH",
            body: {
                hopperId,
                notificationTicket,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}