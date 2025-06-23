import type { PaginatedEventLogTypes } from "~/assets/customTypes";

export const useFetchEventLog = async (
    search: string,
    page: number,
): Promise<PaginatedEventLogTypes> => {
    try {
        const data = await $fetch("/api/admin/systemlogs", {
            method: "POST",
            body: [search, page],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
