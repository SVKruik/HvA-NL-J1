import type { Ref } from "vue";
import type { Burrow } from "~/assets/customTypes";

/**
 * Composable function to fetch related burrows based on tags.
 *
 * @param burrowName - Ref containing the current burrow name.
 * @returns An object containing:
 *   - `relatedBurrows`: Ref of the related burrows array.
 *   - `isLoading`: Ref indicating if the burrows are being loaded.
 *   - `fetchRelatedBurrows`: Function to manually fetch related burrows.
 */
export function useFetchRelatedBurrows(burrowName: Ref<string>) {
    const relatedBurrows = ref<Burrow[]>([]);
    const isLoading = ref(false);

    const fetchRelatedBurrows = async () => {
        if (!burrowName.value) {
            relatedBurrows.value = [];
            return;
        }

        isLoading.value = true;
        try {
            relatedBurrows.value = await $fetch<Burrow[]>(
                `/api/burrow/${burrowName.value}/related`
            );
        } catch (error: any) {
            relatedBurrows.value = [];
            throw formatError(error);
        } finally {
            isLoading.value = false;
        }
    };

    return { relatedBurrows, isLoading, fetchRelatedBurrows };
}
