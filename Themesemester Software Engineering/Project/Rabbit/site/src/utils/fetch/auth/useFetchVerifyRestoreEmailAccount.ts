/**
 * Verify the user's email to unlock password reset functionality.
 * @param recoveryCode The recovery code sent to the user's email.
 * @param email The email address to verify.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchVerifyRestoreEmailAccount = async (recoveryCode: number, email: string): Promise<object> => {
    try {
        return await $fetch("/api/auth/login/email/restore-verify", {
            method: "POST",
            body: {
                recoveryCode,
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