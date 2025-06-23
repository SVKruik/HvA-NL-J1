export const useFetchNotificationSettings = async (hopperId: number): Promise<{
    post_comment: boolean;
    post_praise: boolean;
    comment_reply: boolean;
    comment_praise: boolean;
    buddy_accepted: boolean;
    buddy_request: boolean;
    tail_accepted: boolean;
    tail_request: boolean;
    new_achievement: boolean;
}> => {
    try {
        return await $fetch("/api/user/notification-settings", {
            method: "GET",
            query: {
                hopperId
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}