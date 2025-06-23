import type { BuddyStatus } from "~/assets/customTypes";

export const useFetchBuddyRequest = async (hopperId: number, buddyId: number, status: "add" | "remove"): Promise<BuddyStatus> => {
    try {
        return await $fetch("/api/buddy/request", {
            method: "POST",
            body: {
                hopperId,
                buddyId,
                status,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
};