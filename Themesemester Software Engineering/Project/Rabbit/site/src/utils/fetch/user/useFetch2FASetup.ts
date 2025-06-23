export const useFetch2FASetup = async (status: boolean, email: string, hopperId: number): Promise<void> => {
    try {
        await $fetch("/api/user/2fa/setup", {
            method: "PATCH",
            body: {
                status,
                email,
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