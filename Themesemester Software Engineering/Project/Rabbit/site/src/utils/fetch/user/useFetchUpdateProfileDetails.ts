export const useFetchUpdateProfileDetails = async (formData: FormData): Promise<boolean> => {
    try {
        return await $fetch("/api/user/profile-details", {
            method: "PUT",
            body: formData,
        });
    } catch (error: any) {
        throw formatError(error);
    }
};