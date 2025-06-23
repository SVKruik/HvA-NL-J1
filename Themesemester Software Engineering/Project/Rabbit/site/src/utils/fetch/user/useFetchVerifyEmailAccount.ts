/**
 * Verify the user's email address to unlock extended functionality.
 * @param email The email address to verify.
 * @param verificationPin The verification code sent to the user's email.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchVerifyEmailAccount = async (email: string, verificationPin: number): Promise<void> => {
    try {
        return await $fetch("/api/user/verification-verify", {
            method: "PATCH",
            body: {
                email,
                verificationPin
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}