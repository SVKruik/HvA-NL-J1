import type { BuddyStatus, Hopper } from "~/assets/customTypes";

/**
 * Custom composable for fetching a Hopper (user) resource by username from the API.
 *
 * @returns An object containing:
 * - `hopper`: A ref holding the fetched Hopper object or null.
 * - `hopperId`: A ref holding the Hopper's ID or null.
 * - `fetchHopper`: An async function to fetch the Hopper data.
 *
 * Throws a formatted error on failure.
 */
export function useFetchHopper(username: string, ownId: number | null = null) {
    const hopper = ref<Hopper | null>(null);
    const hopperId = ref<number | null>(null);
    const buddyStatus = ref<BuddyStatus>({ has_connection: false, is_accepted: false, is_incoming: false });

    const fetchHopper = async () => {
        try {
            const res = await $fetch<Hopper>("/api/hopper/" + username, {
                method: "GET",
                query: {
                    ownId
                }
            });
            hopper.value = res;
            hopperId.value = Number(res.id);
            buddyStatus.value = res.buddy_status || { has_connection: false, is_accepted: false, is_incoming: false };
        } catch (error: any) {
            throw formatError(error);
        }
    };

    return { hopper, hopperId, fetchHopper, buddyStatus };
}
