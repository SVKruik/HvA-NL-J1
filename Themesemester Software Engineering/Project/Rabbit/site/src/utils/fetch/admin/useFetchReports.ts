import type { PaginatedReports } from "~/assets/customTypes";

export const useFetchReports = async (
    search: string,
    page: number,
): Promise<PaginatedReports> => {
    try {
        const data = await $fetch("/api/admin/getAllReports", {
            method: "POST",
            body: [search, page],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
