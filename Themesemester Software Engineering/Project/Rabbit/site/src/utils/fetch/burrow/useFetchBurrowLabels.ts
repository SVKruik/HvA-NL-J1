import type { Label } from "~/assets/customTypes";

/**
 * Fetches tags associated with a specific burrow.
 *
 * @param burrowId - The ID of the burrow
 * @returns {Promise<Label[]>} A list of tags for the specified burrow
 */
export const useFetchBurrowLabels = async (
    burrowId?: number,
): Promise<Label[]> => {
    try {
        return await $fetch<Label[]>(`/api/burrow/burrow-labels?burrowId`, {
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
