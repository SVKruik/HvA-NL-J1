<!-- components/PostFeed.vue (or your equivalent name) -->
<script lang="ts" setup>
import { ToastTypes, type ToastItem } from "~/assets/customTypes";
import { useFetchPosts } from "~/utils/fetch/post/useFetchPosts";
import { useFetchBurrowsUser } from "~/utils/fetch/user/useFetchBurrowsUser"; // Import the check function

const user = useUserStore();
const { $event } = useNuxtApp();

const hopperId = computed(() => user.user.id);
const viewerId = computed(() => user.user?.id ?? null);
const { activeSort, posts, isLoading, loadInitialPosts, changeSort } =
    useFetchPosts({ hopperId, viewerId });

// FIX: New reactive ref to control the visibility of the "Joined" tab.
const showJoinedTab = ref(false);

// FIX: A computed property to generate the list of tabs dynamically.
const sortOptions = computed(() => {
    const options: Array<"trending" | "new" | "joined"> = ["trending", "new"];

    // Only add the 'joined' option if our check has confirmed the user has joined burrows.
    if (showJoinedTab.value) {
        options.push("joined");
    }

    return options;
});

onMounted(async () => {
    // --- New Logic to check for joined burrows ---
    // This check runs in parallel with loading the initial posts.
    if (user.user.id) {
        try {
            const userBurrows = await useFetchBurrowsUser(user.user.id);
            // If the user is a member of at least one burrow, we can show the tab.
            if (Array.isArray(userBurrows) && userBurrows.length > 0) {
                showJoinedTab.value = true;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // If this check fails, we can silently ignore it. The tab just won't show.
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message: error.message || "Something went wrong. Please try again.",
                duration: 3,
            } as ToastItem);
        }
    }

    // --- Original Logic to load the posts ---
    try {
        await loadInitialPosts();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        isLoading.value = false;
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        } as ToastItem);
    }
});
</script>

<template>
    <div class="flex flex-col justify-center items-center w-full gap-4 m-auto">
        <div class="text-sm bg-fill items-center h-10 w-full rounded-full p-2 px-5 flex gap-7 max-w-4xl m-auto">
            <!-- FIX: The v-for loop now uses our dynamic 'sortOptions' computed property -->
            <p v-for="option in sortOptions" :key="option" class="cursor-pointer capitalize" :class="option === activeSort
                    ? 'text-font font-semibold'
                    : 'text-font-light'
                " @click="() => changeSort(option)">
                {{ option }}
            </p>
        </div>

        <div class="m-auto w-full max-w-4xl flex flex-col gap-3">
            <PostComponent v-for="post in posts" :key="post.id" v-bind="post" :description-hidden="true"
                @refresh="loadInitialPosts" />
            <div v-if="isLoading" class="flex justify-center items-center mt-4">
                <LoaderComponent />
            </div>
            <p v-if="!isLoading && posts.length === 0" class="text-center text-font-light mt-4">
                No posts found.
            </p>
        </div>
    </div>
</template>
