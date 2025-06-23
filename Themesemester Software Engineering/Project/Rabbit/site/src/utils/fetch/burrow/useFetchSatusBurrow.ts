/**
 * Joins or leaves a burrow.
 * @param burrow_id - The burrow's ID.
 * @param hopper_id - The user's ID.
 * @param join - true to join, false to leave.
 * @returns {Promise<{ success: boolean; joined: boolean }>}
 */
export async function useFetchStatusBurrow(
    burrow_id: number,
    hopper_id: number,
    join: boolean,
): Promise<{ success: boolean; joined: boolean }> {
    try {
        return await $fetch("/api/burrow/join-status", {
            method: "POST",
            body: { burrow_id, hopper_id, join },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(
            error.statusMessage || "Failed to update burrow status.",
        );
    }
}
