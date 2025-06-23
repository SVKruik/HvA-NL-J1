import { ToastTypes, type PostComponentProps, type ToastItem } from "~/assets/customTypes";

/**
 * Composable function to delete a post by ID.
 *
 * @param burrowName - Name of the burrow containing the post.
 * @param postId - ID of the post to delete.
 * @returns An object containing:
 *   - `isDeleting`: Ref indicating if the post is being deleted.
 *   - `deletePost`: Function to delete the post.
 */
export function useFetchPostDelete(post: PostComponentProps) {
    const { $event } = useNuxtApp();
    const isDeleting = ref(false);

    const deletePost = async () => {
        isDeleting.value = true;
        try {
            await $fetch(`/api/burrow/${post.burrow.replace("b/", "")}/post/${post.id}`, {
                method: "DELETE",
            });
        } catch (error: any) {
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message: "Failed to delete post.",
                duration: 3,
            } as ToastItem);
            throw formatError(error);
        } finally {
            isDeleting.value = false;
        }
    };

    return { isDeleting, deletePost };
}
