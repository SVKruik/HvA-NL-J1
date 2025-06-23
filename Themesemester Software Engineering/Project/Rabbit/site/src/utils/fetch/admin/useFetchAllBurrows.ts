import type { PaginatedAllBurrows } from "~/assets/customTypes";

export const useFetchAllBurrows = async (
    search: string,
    page: number,
    tag: string,
): Promise<PaginatedAllBurrows> => {
    try {
        const data = await $fetch("/api/admin/getAllBurrows", {
            method: "POST",
            body: [search, page, tag],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
