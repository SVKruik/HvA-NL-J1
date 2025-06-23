import { watch, onMounted, onUnmounted, type Ref } from "vue";
import {
    ToastTypes,
    type PostComponentProps,
    type ToastItem,
} from "~/assets/customTypes";

/**
 * Composable to fetch and manage posts with infinite scroll, sorting,
 * filtering by burrowId, username, praisedOnly, and tracks praise by viewerId.
 *
 * @param options - Optional object:
 *   - burrowId: Ref<number|null>
 *   - username: Ref<string|null>
 *   - hopperId: Ref<number|null> — used for praisedOnly
 *   - praisedOnly: Ref<boolean>
 *   - viewerId: Ref<number|null> — current logged-in user to track praise values
 */
export function useFetchPosts(options?: {
    burrowId?: Ref<number | null>;
    username?: Ref<string | null>;
    hopperId?: Ref<number | null>;
    praisedOnly?: Ref<boolean>;
    viewerId?: Ref<number | null>;
    lazy?: boolean;
}) {
    const { $event } = useNuxtApp();
    const route = useRoute();
    const router = useRouter();

    const activeSort = ref(
        (route.query.sort as string) === "joined"
            ? "joined"
            : (route.query.sort as string) === "new"
                ? "new"
                : "trending",
    );
    const posts = ref<PostComponentProps[]>([]);
    const loadedIds = ref<number[]>([]);
    const isLoading = ref(false);
    const hasMore = ref(true);
    const scrollStack: PostComponentProps[][] = [];

    const getQuery = () => {
        const query: Record<string, any> = {
            sort: activeSort.value,
            exclude: loadedIds.value.join(","),
        };
        if (options?.burrowId?.value) query.burrow = options.burrowId.value;
        if (options?.username?.value) query.username = options.username.value;
        if (options?.hopperId?.value) query.hopper = options.hopperId.value;
        if (options?.praisedOnly?.value) query.praisedOnly = "true";
        if (options?.viewerId?.value) query.viewer = options.viewerId.value;
        return query;
    };

    const fetchMorePosts = async () => {
        try {
            return await $fetch<PostComponentProps[]>("/api/posts", {
                query: getQuery(),
            });
        } catch (error: any) {
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message:
                    error.message || "Something went wrong. Please try again.",
                duration: 3,
            } as ToastItem);
        }
    };

    const loadInitialPosts = async () => {
        isLoading.value = true;
        try {
            const result = await $fetch<PostComponentProps[]>("/api/posts", {
                query: { ...getQuery(), exclude: "" },
            });
            posts.value = result ?? [];
            loadedIds.value = posts.value.map((p) => p.id);
            scrollStack.length = 0;
            scrollStack.push([...posts.value]);
            hasMore.value = posts.value.length > 0;
        } catch (error: any) {
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message:
                    error.message || "Something went wrong. Please try again.",
                duration: 3,
            } as ToastItem);
        } finally {
            isLoading.value = false;
        }
    };

    const loadMore = async () => {
        if (isLoading.value || !hasMore.value) return;
        isLoading.value = true;

        const newPosts = await fetchMorePosts();
        if (!newPosts) {
            isLoading.value = false;
            return;
        }
        if (newPosts.length) {
            posts.value.push(...newPosts);
            scrollStack.push([...newPosts]);
            loadedIds.value.push(...newPosts.map((p) => p.id));
        } else {
            hasMore.value = false;
        }
        isLoading.value = false;
    };

    const changeSort = (sort: "trending" | "new" | "joined") => {
        if (sort === activeSort.value) return;
        activeSort.value = sort;
        router.replace({ query: { ...route.query, sort } });
        posts.value = [];
        loadedIds.value = [];
        scrollStack.length = 0;
        hasMore.value = true;
        loadInitialPosts();
    };

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        if (scrollY + windowHeight >= documentHeight * 0.8) loadMore();
    };

    watch(
        () => route.query.sort,
        (val) => {
            if (val === "joined" || val === "new" || val === "trending") {
                activeSort.value = val;
                resetAndLoad();
            }
        },
    );

    onMounted(() => window.addEventListener("scroll", handleScroll));
    onUnmounted(() => window.removeEventListener("scroll", handleScroll));

    const resetAndLoad = () => {
        posts.value = [];
        loadedIds.value = [];
        scrollStack.length = 0;
        hasMore.value = true;
        loadInitialPosts();
    };

    if (!options?.lazy) {
        if (options?.burrowId) watch(options.burrowId, resetAndLoad);
        if (options?.username) watch(options.username, resetAndLoad);
        if (options?.hopperId) watch(options.hopperId, resetAndLoad);
        if (options?.praisedOnly) watch(options.praisedOnly, resetAndLoad);
        if (options?.viewerId) watch(options.viewerId, resetAndLoad);
    }

    return {
        activeSort,
        posts,
        isLoading,
        loadInitialPosts,
        loadMore,
        changeSort,
        handleScroll,
        resetAndLoad
    };
}
