import type { PaginatedHoppers } from "~/assets/customTypes";

export const useFetchHoppers = async (
    search: string,
    page: number,
    burrowFilter: string,
): Promise<PaginatedHoppers> => {
    try {
        const data = await $fetch("/api/admin/getAllHoppers", {
            method: "POST",
            body: [search, page, burrowFilter],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
