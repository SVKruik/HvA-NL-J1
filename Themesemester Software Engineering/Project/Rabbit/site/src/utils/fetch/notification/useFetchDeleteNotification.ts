export const useFetchDeleteNotification = async (hopperId: number, notificationTicket: string): Promise<boolean> => {
    try {
        return await $fetch("/api/notification", {
            method: "DELETE",
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