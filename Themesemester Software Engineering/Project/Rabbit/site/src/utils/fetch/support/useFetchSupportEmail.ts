/**
 * Send the verification email to the user's account.
 * @param email The email address to send the verification email to.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchSupportEmail = async (
    email: string,
    hopper_id: number,
    hopper_name: string,
    title: string,
    message: string,
): Promise<object> => {
    try {
        return await $fetch("/api/support/createSupportTicketEmail", {
            method: "POST",
            body: {
                email,
                hopper_id,
                hopper_name,
                title,
                message,
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
