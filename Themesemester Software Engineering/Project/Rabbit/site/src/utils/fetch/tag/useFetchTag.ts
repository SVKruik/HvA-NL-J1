import type { Tag } from "~/assets/customTypes";

export const useFetchTag = async (): Promise<Tag[]> => {
    try {
        const data = await $fetch<Tag[]>("/api/tag", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
