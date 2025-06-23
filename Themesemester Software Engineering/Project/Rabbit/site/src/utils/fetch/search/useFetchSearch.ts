import type { SearchResponse } from "~/assets/customTypes";

/**
 * Search the specified indices with the given query.
 * @param query The search query string.
 * @param scope The indices to search in.
 * @param offset The number of results to skip.
 * @param limit The maximum number of results to return.
 * @returns The search results.
 */
export const useFetchSearch = async (query: string, scope: Array<string>, offset: number, limit: number): Promise<SearchResponse> => {
    try {
        return await $fetch("/api/search", {
            method: "POST",
            body: {
                query,
                scope,
                offset,
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