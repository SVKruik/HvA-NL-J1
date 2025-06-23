import type { newBurrow } from "~/assets/customTypes";

export const useFetchBurrowCreate = async (
    burrow: FormData,
): Promise<newBurrow> => {
    try {
        const data = await $fetch<newBurrow>("/api/burrow/createBurrow", {
            method: "POST",
            body: burrow,
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.statusMessage || "Failed to create post.", {
            cause: { statusCode: error.statusCode || 500 },
        });
    }
};
