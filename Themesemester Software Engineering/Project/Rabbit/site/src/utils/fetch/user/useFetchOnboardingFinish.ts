/**
 * Setup the user onboarding after completing the steps.
 * @param hopperId The ID of the user.
 * @param nsfwAllowed If the user allows NSFW content.
 * @param joinedBurrows The selected Burrows.
 * @returns Status of the operation.
 */
export const useFetchOnboardingFinish = async (hopperId: number, nsfwAllowed: boolean, joinedBurrows: Array<number>): Promise<boolean> => {
    try {
        return await $fetch("/api/user/onboarding", {
            method: "POST",
            body: {
                hopperId,
                nsfwAllowed,
                joinedBurrows
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        throw formatError(error);
    }
}