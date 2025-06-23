export const useBanBurrow = async (
    name: string,
    reason: string,
): Promise<string> => {
    try {
        const data = await $fetch("/api/admin/banBurrow", {
            method: "POST",
            body: [name, reason],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
