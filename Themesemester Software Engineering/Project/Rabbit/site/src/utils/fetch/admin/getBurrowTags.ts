import type { BurrowTags } from "~/assets/customTypes";

export const useFetchBurrowTags = async (): Promise<BurrowTags> => {
    try {
        const data = await $fetch("/api/admin/getBurrowTags", {
            method: "POST",
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(
            error.statusMessage ||
                "Something went wrong. Please try again later.",
            { cause: { statusCode: error.statusCode || 500 } },
        );
    }
};
