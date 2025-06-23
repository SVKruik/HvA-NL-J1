export const useFetchUpdateNotificationSettings = async (hopperId: number, formData: {
    post_comment: boolean;
    post_praise: boolean;
    comment_reply: boolean;
    comment_praise: boolean;
    buddy_accepted: boolean;
    buddy_request: boolean;
    tail_accepted: boolean;
    tail_request: boolean;
    new_achievement: boolean;
}): Promise<boolean> => {
    try {
        return await $fetch("/api/user/notification-settings", {
            method: "PUT",
            body: {
                hopperId,
                ...formData
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}