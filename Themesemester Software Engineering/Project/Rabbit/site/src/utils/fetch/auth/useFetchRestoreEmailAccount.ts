import type { UserData } from "~/assets/customTypes";

/**
 * Update the password of an email account.
 * @param newPassword The new password for the email account.
 * @param confirmPassword  The confirmation of the new password.
 * @param email The email address of the account to update.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchRestoreEmailAccount = async (newPassword: string, confirmPassword: string, email: string): Promise<UserData> => {
    try {
        const { fetch: fetchSession } = useUserSession();
        const data = await $fetch("/api/auth/login/email/restore", {
            method: "POST",
            body: {
                newPassword,
                confirmPassword,
                email,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        await fetchSession();
        return data;
    } catch (error: any) {
        throw formatError(error);
    }
}