import type { Burrow } from "~/assets/customTypes";

export const useFetchBurrows = async (): Promise<Burrow[]> => {
    try {
        return await $fetch<Burrow[]>("/api/burrow", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
