import { ToastTypes, type ToastItem } from "~/assets/customTypes";

/**
 * Updates a comment with new content.
 * This function sends a PUT request to update the specified comment and manages the loading state.
 * On success, it emits a toast notification.
 * @param commentId - The ID of the comment to update.
 * @param content - The new content for the comment.
 * @returns An object containing the updateComment function and an updating state.
 */
export function useFetchCommentUpdate() {
    const { $event } = useNuxtApp();
    const isUpdating = ref(false);

    async function updateComment({
        commentId,
        content,
    }: {
        commentId: number;
        content: string;
    }) {
        isUpdating.value = true;
        try {
            await $fetch(`/api/comments/${commentId}`, {
                method: "PUT",
                body: { content },
            });
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.success,
                message: "Comment successfully updated.",
                duration: 3,
            } as ToastItem);
        } finally {
            isUpdating.value = false;
        }
    }

    return { updateComment, isUpdating };
}
