/**
 * Fetches the praise status of a post for a specific hopper.
 *
 * @param postId - The ID of the post.
 * @param hopperId - The ID of the hopper (user).
 * @returns An object with:
 *   - `praiseValue`: Ref<number | null> (-1, 0, 1)
 *   - `isLoading`: Ref<boolean>
 *   - `fetchPraise`: Function to trigger the fetch
 */
export function useFetchPraisePost(postId: number, hopperId: number) {
    const praiseValue = ref<number | null>(null);
    const isLoading = ref(false);

    const fetchPraise = async () => {
        isLoading.value = true;
        try {
            const res = await $fetch<{ value: number }>('/api/praise/' + postId + '/' + hopperId);
            praiseValue.value = res.value ?? 0;
        } catch (error) {
            praiseValue.value = 0; // fallback to neutral
        } finally {
            isLoading.value = false;
        }
    };

    return { praiseValue, isLoading, fetchPraise };
}
