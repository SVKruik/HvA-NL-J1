/**
 * Send a verification email to the user's account.
 * @param email The email address to send the verification email to.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchSendVerifyEmailAccount = async (email: string): Promise<void> => {
    try {
        return await $fetch("/api/user/verification-send", {
            method: "POST",
            body: {
                email
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}