/**
 * Checks if a hopper is a member of a burrow.
 * @param burrow_id - The burrow's ID.
 * @param hopper_id - The user's ID.
 * @returns {Promise<boolean>}
 */
export async function useFetchBurrowMemberStatus(
    burrow_id: number,
    hopper_id: number,
): Promise<boolean> {
    try {
        const result = await $fetch<{ is_member: number }>(
            "/api/burrow/member-status",
            {
                method: "GET",
                params: { burrow_id, hopper_id },
            },
        );
        return !!result.is_member;
    } catch {
        return false;
    }
}
