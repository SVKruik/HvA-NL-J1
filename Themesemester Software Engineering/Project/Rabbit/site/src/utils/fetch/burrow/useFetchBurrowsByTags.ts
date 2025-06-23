/**
 * Get Burrows by tags.
 * @param tags The tags to filter the Burrows by.
 * @returns The Burrows that match the tags.
 */
export async function useFetchBurrowsByTags(tags: Array<{ "name": string, "category": string }>): Promise<Array<{ "id": number; "name": string, "avatar": string }>> {
    try {
        return await $fetch("/api/burrow/by-tags", {
            method: "POST",
            body: {
                tags,
            }
        });
    } catch (error: any) {
        throw formatError(error);
    }
}