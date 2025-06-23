/**
 * Give a user a timeout.
 * @param hopperId The ID of the user to timeout.
 * @param timeoutHours The number of hours to timeout the user.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchTimeout = async (hopperId: number, timeoutHours: number, reason: string): Promise<object> => {
    try {
        return await $fetch("/api/admin/timeout", {
            method: "PATCH",
            body: {
                hopperId,
                timeoutHours,
                reason
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}