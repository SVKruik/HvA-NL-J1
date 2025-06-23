import type { PaginatedKeeperBurrowTypes } from "~/assets/customTypes";

export const useFetchKeepersEditTable = async (
    search: string,
    page: number,
): Promise<PaginatedKeeperBurrowTypes> => {
    const route = useRoute();
    const burrowName = ref<string | string[]>(route.params.name);

    try {
        const data = await $fetch(
            `/api/burrow/${burrowName.value}/keepers-table`,
            {
                method: "POST",
                body: [search, page],
            },
        );
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
