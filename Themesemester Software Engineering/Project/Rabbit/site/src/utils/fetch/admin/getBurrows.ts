export const getBurrows = async (): Promise<string[]> => {
    try {
        const data = await $fetch("/api/admin/getBurrows", {
            method: "POST",
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
