export const useFetchProfileDetails = async (hopperId: number): Promise<{
    description: string | null;
    socials: Array<{
        name: string;
        url: string;
    }>;
    avatar: string | null;
    banner: string | null;
    isNsfw: boolean;
}> => {
    try {
        return await $fetch("/api/user/profile-details", {
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