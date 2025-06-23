export const useFetchFeedSettings = async (hopperId: number): Promise<{
    can_view_nsfw: boolean;
}> => {
    try {
        return await $fetch("/api/user/feed-settings", {
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