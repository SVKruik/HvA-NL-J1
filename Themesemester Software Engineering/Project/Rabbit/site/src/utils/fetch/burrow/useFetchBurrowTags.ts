import type { Tag } from "~/assets/customTypes";

/**
 * Fetches tags associated with a specific burrow.
 *
 * @param burrowId - The ID of the burrow
 * @returns {Promise<Tag[]>} A list of tags for the specified burrow
 */
export const useFetchBurrowTags = async (burrowId?: number): Promise<Tag[]> => {
    try {
        return await $fetch<Tag[]>(`/api/burrow/burrow-tags?burrowId`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            query: {
                burrowId,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
