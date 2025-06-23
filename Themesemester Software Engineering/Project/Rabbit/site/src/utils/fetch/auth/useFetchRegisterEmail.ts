import type { UserData } from "~/assets/customTypes";

/**
 * Register a new user via email.
 * @param payload The composite form data to send to the server.
 * @returns The response from the API.
 * @throws An error if the request fails.
 */
export const useFetchRegisterEmail = async (payload: FormData): Promise<UserData> => {
    try {
        const { fetch: fetchSession } = useUserSession();
        const data = await $fetch("/api/auth/register/email", {
            method: "POST",
            body: payload,
        });
        await fetchSession();
        return data;
    } catch (error: any) {
        throw formatError(error);
    }
}