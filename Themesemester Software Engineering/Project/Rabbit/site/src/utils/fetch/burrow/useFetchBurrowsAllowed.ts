import type { Burrow } from "~/assets/customTypes";

/**
 * @description Fetches tags associated with a specific burrow.
 * @param burrowId - The ID of the burrow
 * @returns A list of tags for the specified burrow
 * @throws {Error} - Throws an error if the burrowId is invalid or if there is a network error.
 */
export const useFetchBurrowsAllowed = async (burrowId: number): Promise<Burrow[]> => {
    try {
        return await $fetch<Burrow[]>(
            `/api/burrow/allowed-burrows?burrowId=${burrowId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
