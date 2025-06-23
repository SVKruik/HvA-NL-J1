import { useRoute } from "vue-router";
import type { Burrow } from "~/assets/customTypes";

/**
 * Custom composable for fetching a Burrow resource by name from the API.
 *
 * @returns An object containing:
 * - `burrow`: A ref holding the fetched Burrow object or null.
 * - `burrowId`: A ref holding the Burrow's ID or null.
 * - `fetchBurrow`: An async function to fetch the Burrow data.
 *
 * Emits a toast event on error.
 */
export function useFetchBurrow() {
    const route = useRoute();
    const burrowName = ref<string | string[]>(route.params.name);

    const burrow = ref<Burrow | null>(null);
    const burrowId = ref<number | null>(null);

    const fetchBurrow = async () => {
        try {
            const res = await $fetch<Burrow>("/api/burrow/" + burrowName.value, {
                method: "GET",
            });
            burrow.value = res;
            burrowId.value = res.id;
        } catch (error: any) {
            throw formatError(error);
        }
    };

    return { burrow, burrowId, fetchBurrow };
}
