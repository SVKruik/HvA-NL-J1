import type { UserData } from "~/assets/customTypes";

export const useFetch2FAVerify = async (email: string, code: number): Promise<UserData> => {
    try {
        const { fetch: fetchSession } = useUserSession();
        const data = await $fetch("/api/user/2fa/verify", {
            method: "GET",
            query: {
                email,
                code,
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