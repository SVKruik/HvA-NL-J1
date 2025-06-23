/**
 * Send the verification email to the user's account.
 * @param email The email address to send the verification email to.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchNewKeeperEmail = async (
    email: string,
    hopper_id: number,
    burrow_id: number,
    burrow_name: string,
): Promise<object> => {
    try {
        return await $fetch("/api/burrow/send-keeper", {
            method: "POST",
            body: {
                email,
                hopper_id,
                burrow_id,
                burrow_name,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
