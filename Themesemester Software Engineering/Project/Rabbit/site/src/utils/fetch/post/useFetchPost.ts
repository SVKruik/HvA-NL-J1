import type { PostComponentProps } from "~/assets/customTypes";

/**
 * Composable function to fetch a single post by ID.
 *
 * @param burrowName - Ref containing the burrow name.
 * @param postId - Ref containing the post ID.
 * @returns An object containing:
 *   - `post`: Ref of the loaded post.
 *   - `isLoading`: Ref indicating if the post is being loaded.
 *   - `fetchPost`: Function to manually fetch the post.
 */
export function useFetchPost(
    burrowName: Ref<string>,
    postId: Ref<string>,
    hopperId?: Ref<number | null>
) {
    const post = ref<PostComponentProps | null>(null);
    const isLoading = ref(false);

    const fetchPost = async () => {
        isLoading.value = true;
        try {
            const query = hopperId?.value ? `?hopper=${hopperId.value}` : "";
            post.value = await $fetch<PostComponentProps>(
                `/api/burrow/${burrowName.value}/post/${postId.value}${query}`
            );
        } catch (error: any) {
            post.value = null;
            throw formatError(error);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => fetchPost());

    watch([burrowName, postId, hopperId], () => fetchPost());

    return { post, isLoading, fetchPost };
}