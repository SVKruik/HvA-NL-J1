/**
 * Update the Hopper's credentials.
 * @param email The new email address for the user.
 * @param password The new password for the user.
 * @param confirmPassword The confirmation of the new password.
 * @param hopperId The ID of the user whose credentials are being updated.
 * @returns Status of the operation.
 */
export const useFetchUpdateCredentials = async (email: string, password: string | null, confirmPassword: string | null, hopperId: number): Promise<boolean> => {
    try {
        return await $fetch("/api/user/credentials", {
            method: "PATCH",
            body: {
                email,
                password,
                confirmPassword,
                hopperId
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}