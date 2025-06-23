import type { SearchResponse } from "~/assets/customTypes";

/**
 * Search the whole site with the given query.
 * @param query The search query string.
 * @param limit The maximum number of results to return.
 * @returns The search results.
 */
export const useFetchSearchGlobal = async (query: string, limit: number): Promise<SearchResponse> => {
    try {
        return await $fetch("/api/search/global", {
            method: "POST",
            body: {
                query,
                limit
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}