export const useDeleteBurrow = async (name: string): Promise<string> => {
    try {
        const data = await $fetch("/api/admin/deleteBurrow", {
            method: "POST",
            body: [name],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
