import type { BurrowSideBar } from "~/assets/customTypes";

/**
 * Fetches the burrows for a user by their ID.
 * @param hopper_id The ID of the user to fetch burrows for
 * @throws An error if the request fails.
 * @description Fetches the burrows for a user by their ID.
 */
export const useFetchPopularBurrows = async (): Promise<BurrowSideBar[]> => {
    try {
        return $fetch("/api/user/popularBurrows", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
