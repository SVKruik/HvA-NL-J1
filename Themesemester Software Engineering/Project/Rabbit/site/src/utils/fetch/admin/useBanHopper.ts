export const useBanHopper = async (
    id: number,
    reason: string,
    email: string,
): Promise<string> => {
    try {
        const data = await $fetch("/api/admin/banHopper", {
            method: "POST",
            body: [id, reason, email],
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatError(error);
    }
};
