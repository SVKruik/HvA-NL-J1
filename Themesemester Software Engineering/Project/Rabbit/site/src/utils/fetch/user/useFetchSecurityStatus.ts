export const useFetchSecurityStatus = async (hopperId: number): Promise<{
    date_verification: string | null;
    date_2fa: string | null;
}> => {
    try {
        return await $fetch("/api/user/security-status", {
            method: "GET",
            query: {
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