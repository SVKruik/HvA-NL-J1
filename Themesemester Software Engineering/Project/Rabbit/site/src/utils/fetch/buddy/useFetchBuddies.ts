import { ref, computed } from 'vue';
import type { Buddy } from '~/assets/customTypes';

export function useFetchBuddies(username: string, viewerId?: number) {
    const buddies = ref<Buddy[]>([]);
    const isLoading = ref(false);
    const search = ref("");

    const fetchBuddies = async () => {
        if (!username) return;
        isLoading.value = true;
        try {
            const query = viewerId ? { viewerId } : undefined;
            const response = await $fetch<Buddy[]>(`/api/hopper/${username}/buddies`, {
                query,
            });
            buddies.value = response;
        } catch (e) {
            buddies.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    const filteredBuddies = computed(() => {
        return buddies.value
            .filter((b) =>
                b.username.toLowerCase().includes(search.value.toLowerCase())
            )
            .sort((a, b) => {
                const favA = Number(a.is_favorite || false);
                const favB = Number(b.is_favorite || false);
                const pendA = Number(a.isPending || false);
                const pendB = Number(b.isPending || false);

                // favorieten eerst, dan pending, dan alfabetisch
                if (favA !== favB) return favB - favA;
                if (pendA !== pendB) return pendB - pendA;
                return a.username.localeCompare(b.username);
            });
    });

    return {
        buddies,
        filteredBuddies,
        search,
        fetchBuddies,
        isLoading,
    };
}