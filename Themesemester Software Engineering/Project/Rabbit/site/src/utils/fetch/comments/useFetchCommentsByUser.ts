import { ref } from "vue";
import { useNuxtApp } from "#app";
import type { Comment, ToastItem } from "~/assets/customTypes";
import { ToastTypes } from "~/assets/customTypes";

/**
 * Fetch comments by user ID, optionally include viewer ID.
 * This function retrieves comments made by a specific user (hopperId).
 * If a viewerId is provided, it will also include comments made by that user.
 * @param hopperId - The ID of the user whose comments are to be fetched.
 * @param viewerId - Optional ID of the viewer to include their comments as well.
 * @return An object containing the comments, loading state, and a function to fetch comments.
 * 
 */
export function useFetchCommentsByUser(hopperId: number, viewerId?: number) {
  const { $event } = useNuxtApp();
  const comments = ref<Comment[]>([]);
  const isLoading = ref(false);

  const fetchComments = async () => {
    isLoading.value = true;
    try {
      const queryString = viewerId ? `?viewerId=${viewerId}` : "";
      comments.value = await $fetch<Comment[]>(
        `/api/comments/user/${hopperId}${queryString}`
      );
    } catch (error: any) {
      $event("emit-toast", {
        id: createTicket(4),
        type: ToastTypes.danger,
        message: "Failed to fetch comments.",
        duration: 3,
      } as ToastItem);
    } finally {
      isLoading.value = false;
    }
  };

  return { comments, isLoading, fetchComments };
}