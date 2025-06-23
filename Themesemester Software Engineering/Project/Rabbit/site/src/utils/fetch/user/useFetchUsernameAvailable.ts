/**
 * Check if a username is available
 * @param username The username to check
 * @returns True if the username is available, false if it is taken
 * @throws An error if the request fails.
 */
export const useFetchUsernameAvailable = async (username: string): Promise<boolean> => {
    try {
        return $fetch("/api/user/username-available", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            query: {
                "username": username
            }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}