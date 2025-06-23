import type { BuddyStatus } from "~/assets/customTypes";

export const useFetchBuddyAccept = async (hopperId: number, buddyId: number, status: "accept" | "decline"): Promise<BuddyStatus> => {
    try {
        return await $fetch("/api/buddy/accept", {
            method: "PUT",
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
}