// composables/fetch/post/useFetchPraisedPosts.ts
import { ref } from "vue";
import { useNuxtApp } from "#app";
import type { PostComponentProps, ToastItem } from "~/assets/customTypes";
import { ToastTypes } from "~/assets/customTypes";

/**
 * Composable to fetch all posts praised by a given hopper (user).
 *
 * @param hopperId - The ID of the hopper.
 * @returns Object with:
 *   - `praisedPosts`: Ref<PostComponentProps[]>
 *   - `isLoading`: Ref<boolean>
 *   - `fetchPraisedPosts`: Function to trigger the fetch
 */
export function useFetchPraisedPosts(username: string) {
    const { $event } = useNuxtApp();
    const praisedPosts = ref<PostComponentProps[]>([]);
    const isLoading = ref(false);
  
    const fetchPraisedPosts = async () => {
      isLoading.value = true;
      try {
        praisedPosts.value = await $fetch<PostComponentProps[]>(
          `/api/praise/posts/${username}`
        );
      } catch (error: any) {
        $event("emit-toast", {
          id: createTicket(4),
          type: ToastTypes.danger,
          message: "Failed to fetch praised posts.",
          duration: 3,
        } as ToastItem);
      } finally {
        isLoading.value = false;
      }
    };
  
    return { praisedPosts, isLoading, fetchPraisedPosts };
  }  