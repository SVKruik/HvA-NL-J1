import { ToastTypes, type ToastItem } from "~/assets/customTypes";

/**
 * Delete a comment from a post in the burrow.
 * This function allows users to delete a specific comment.
 * It handles the deletion process and manages the loading state.
 * @param commentId - The ID of the comment to be deleted.
 * @return An object containing the deleteComment function and a loading state.
 */
export function useFetchCommentDelete() {
    const { $event } = useNuxtApp();
    const isDeleting = ref(false);

    async function deleteComment(commentId: number) {
        isDeleting.value = true;
        try {
            await $fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.success,
                message: "Succesfully deleted comment.",
                duration: 3,
            } as ToastItem);
        } finally {
            isDeleting.value = false;
        }
    }

    return { deleteComment, isDeleting };
}