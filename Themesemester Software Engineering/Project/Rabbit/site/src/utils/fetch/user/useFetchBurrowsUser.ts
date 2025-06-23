import type { BurrowSideBar } from "~/assets/customTypes";

/**
 * Fetches the burrows for a user by their ID.
 * @param hopper_id The ID of the user to fetch burrows for
 * @throws An error if the request fails.
 * @description Fetches the burrows for a user by their ID.
 */
export const useFetchBurrowsUser = async (
    hopper_id: number,
): Promise<BurrowSideBar[]> => {
    try {
        return $fetch("/api/user/burrows", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            query: {
                hopper_id: hopper_id,
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
};
