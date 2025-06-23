export const isHopperBanned = async (id: number): Promise<boolean> => {
    try {
        const data = await $fetch("/api/admin/isHopperBanned", {
            method: "POST",
            body: [id],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
