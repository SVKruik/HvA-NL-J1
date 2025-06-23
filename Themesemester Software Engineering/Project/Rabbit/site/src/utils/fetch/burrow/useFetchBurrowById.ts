import type { Burrow } from "~/assets/customTypes";

/**
 * Fetches tags associated with a specific burrow.
 *
 * @param burrowId - The ID of the burrow
 * @returns {Promise<Burrow>} A list of tags for the specified burrow
 */
export const useFetchBurrowById = async (
    burrowId?: number,
): Promise<Burrow> => {
    try {
        return await $fetch<Burrow>(`/api/burrow/burrow-by-id?burrowId`, {
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
