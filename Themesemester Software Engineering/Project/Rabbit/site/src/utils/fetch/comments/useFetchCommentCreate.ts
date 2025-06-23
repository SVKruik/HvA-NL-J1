import { ToastTypes, type ToastItem } from "~/assets/customTypes";

/**
 *  Create comments for a post in the burrow.
 * This function allows users to submit comments on a specific post.
 * It handles the submission process and manages the loading state.
 * @param content - The content of the comment to be created.
 * @param postId - The ID of the post to which the comment belongs.
 * @param hopperId - The ID of the user creating the comment.
 * @param parentCommentId - Optional ID of the parent comment if this is a reply.
 * @return An object containing the createComment function and a loading state.
 * 
 */
export function useFetchCommentCreate() {
    const { $event } = useNuxtApp();
    const userStore = useUserStore();
    const isSubmitting = ref(false);
    const hopperId = userStore.user.id;

    async function createComment({
        content,
        postId,
        parentCommentId = null,
    }: {
        content: string;
        postId: number;
        parentCommentId?: number | null;
    }) {
        isSubmitting.value = true;
        try {
            await $fetch("/api/comments/post", {
                method: "POST",
                body: {
                    content,
                    postId,
                    hopperId,
                    parentCommentId,
                },
            });
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.success,
                message: "Succesfully posted comment.",
                duration: 3,
            } as ToastItem);
        } finally {
            isSubmitting.value = false;
        }
    }

    return { createComment, isSubmitting };
}