export const useFetchUpdateFeedSettings = async (hopperId: number, formData: {
    can_view_nsfw: boolean;
}): Promise<boolean> => {
    try {
        return await $fetch("/api/user/feed-settings", {
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
};