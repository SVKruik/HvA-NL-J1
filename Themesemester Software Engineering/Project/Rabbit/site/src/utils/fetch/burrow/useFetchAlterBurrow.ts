import type { Burrow } from "~/assets/customTypes";

export const useFetchAlterBurrow = async (
    burrow: FormData,
): Promise<Burrow> => {
    try {
        const data = await $fetch<Burrow>("/api/burrow/alterBurrow", {
            method: "PUT",
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
