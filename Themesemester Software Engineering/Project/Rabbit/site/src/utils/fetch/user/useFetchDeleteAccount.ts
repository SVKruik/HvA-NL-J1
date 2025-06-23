export const useFetchDeleteAccount = async (email: string): Promise<boolean> => {
    try {
        return await $fetch("/api/user", {
            method: "DELETE",
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