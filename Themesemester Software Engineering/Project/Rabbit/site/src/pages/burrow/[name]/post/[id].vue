<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import PostComponent from "~/components/PostComponent.vue";
import Callout from "~/components/admin/components/Callout.vue";
import CommentComponent from "~/components/CommentComponent.vue";
import BurrowSidebar from "~/components/BurrowSidebar.vue";
import LoaderComponent from "~/components/LoaderComponent.vue";
import { useFetchBurrow } from "~/utils/fetch/burrow/useFetchBurrow";
import { useFetchCommentsByPost } from "~/utils/fetch/comments/useFetchCommentsByPost";
import { useFetchPost } from "~/utils/fetch/post/useFetchPost";
import { useFetchCommentCreate } from "~/utils/fetch/comments/useFetchCommentCreate";
import { ToastTypes, type ToastItem } from "~/assets/customTypes";

// Page meta configuration
definePageMeta({
    path: "/b/:name/post/:id",
});

// Composables and stores
const { $event } = useNuxtApp();
const userStore = useUserStore();
const route = useRoute();

// Route parameters
const name = ref(route.params.name?.toString() ?? "");
const postId = ref(route.params.id?.toString() ?? "");
const userId = ref(userStore.user.id ? Number(userStore.user.id) : null);

// Data fetching composables
const { burrow, fetchBurrow } = useFetchBurrow();
const { post, fetchPost } = useFetchPost(name, postId, userId);
const { comments, fetchComments } = useFetchCommentsByPost(Number(postId.value), Number(userId.value));
const { createComment } = useFetchCommentCreate();

// Reactive data
const postError = ref<string | null>(null);
const commentInput = ref("");
const searchQuery = ref("");
const showSortDropdown = ref(false);
const sortMode = ref<"new" | "old" | "top">("new");
const isCommentsLoading = ref(false);

// Configuration
const sortOptions = [
    { value: "new", label: "Newest", icon: "fi fi-sr-clock" },
    { value: "old", label: "Oldest", icon: "fi fi-sr-time-past" },
    { value: "top", label: "Most Praised", icon: "fi fi-sr-thumbs-up" },
];


// Component lifecycle
onMounted(async () => {
    try {
        // Initial data fetching
        await fetchBurrow();
        await fetchPost();
        try {
            isCommentsLoading.value = true;
            await fetchComments();
            isCommentsLoading.value = false;
        } catch (e) {
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message: "Failed to load comments.",
                duration: 3,
            } as ToastItem);
        }
        if (!post.value) postError.value = "This post does not exist.";
    } catch (e) {
        postError.value = "This post does not exist.";
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: "Failed to load post.",
            duration: 3,
        } as ToastItem);
    }
});

/**
 * Submits a new comment to the post.
 * Validates the comment input and checks if the user is logged in.
 * If validation passes, it creates the comment and fetches the updated comments and post data.
 * @returns {Promise<void>}
 */
async function submitComment(): Promise<void> {
    if (!userId.value) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "You must be logged in to comment.",
            duration: 3,
        } as ToastItem);
        return;
    }

    const content = commentInput.value.trim();
    if (!content) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "Comment cannot be empty.",
            duration: 3,
        } as ToastItem);
        return;
    }
    if (content.length < 2) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "Comment is too short.",
            duration: 3,
        } as ToastItem);
        return;
    }
    if (content.length > 500) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "Comment is too long (max 500 characters).",
            duration: 3,
        } as ToastItem);
        return;
    }

    await createComment({
        content,
        postId: Number(postId.value),
    });

    commentInput.value = "";
    await fetchComments();
    await fetchPost();
}

/**
 * Filters and sorts comments based on the selected sort mode and search query.
 * @returns {Array} Filtered and sorted comments.
 */
const filteredComments = computed(() => {
    const q = searchQuery.value.toLowerCase().trim();

    const matches = (c: typeof comments.value[number]) =>
        (c.content ?? "").toLowerCase().includes(q) ||
        (c.username ?? "").toLowerCase().includes(q);

    const existingIds = new Set(comments.value.map(c => c.id));
    const base = comments.value.filter(c =>
        c.commentId === null || !existingIds.has(c.commentId)
    );

    if (!q) {
        const sorted = [...base].sort((a, b) => {
            if (sortMode.value === "new") return b.id - a.id;
            if (sortMode.value === "old") return a.id - b.id;
            if (sortMode.value === "top") return (b.upvotes ?? 0) - (a.upvotes ?? 0);
            return 0;
        });
        return sorted;
    }

    return comments.value.filter(matches);
});
</script>

<template><!-- Show error callout if post not found -->
<div v-if="postError" class="flex justify-center max-w-5xl mx-auto px-4">
    <Callout title="Post Not Found" :description="postError" variant="warning" />
</div>

<!-- Main post and comments section -->
<div v-else-if="post"
    class="flex flex-col lg:flex-row justify-center items-start w-full gap-4 pt-0 lg:px-4 lg:pr-0 mb-8">
    <!-- Left side: Post content and comments -->
    <div class="flex-1 flex flex-col w-full sm:max-w-4xl mx-auto">
        <!-- Post display -->
        <PostComponent :key="post.id + post.comments" v-bind="post" :single-view="true" @refresh="fetchPost"
            @delete="navigateTo(`/${post.burrow}`)" />

        <div class="w-full max-w-4xl mx-auto mt-4">
            <!-- Comment input section -->
            <div class="relative flex items-center mb-4">
                <!-- If user is logged in, show comment input -->
                <template v-if="userId">
                    <i
                        class="fi fi-sr-comment -mt-1 absolute left-4 w-4 h-4 text-font-light pointer-events-none z-20"></i>
                    <input v-model="commentInput" type="text" placeholder="Write a comment..."
                        class="rounded-full p-2 px-5 pl-11 text-sm text-font bg-fill border-none placeholder:text-font-light w-full pr-14"
                        @keyup.enter="submitComment" />
                    <!-- Clear comment button -->
                    <button v-if="commentInput" @click="commentInput = ''"
                        class="absolute right-14 z-20 flex items-center justify-center w-5 h-5 rounded-full hover:bg-fill-hover"
                        type="button" aria-label="Clear comment">
                        <svg class="w-4 h-4 text-font-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <!-- Submit comment button -->
                    <button @click="submitComment"
                        class="absolute right-2 -mb-1 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-font-light hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!commentInput" type="button" aria-label="Post comment">
                        <i class="fi fi-br-arrow-turn-down-right"></i>
                    </button>
                </template>
                <!-- If user is not logged in, show message -->
                <template v-else>
                    <div class="w-full text-center text-font-light py-2">
                        You must be logged in to comment on posts.
                    </div>
                </template>
            </div>

            <!-- Search and sort controls (only if there are comments) -->
            <div v-if="comments.length > 0"
                class="text-sm bg-fill justify-between items-center h-10 w-full rounded-full p-3 pl-1 pr-1.5 px-4 flex gap-5 mb-4">
                <!-- Search input for comments -->
                <div class="relative flex-1">
                    <i
                        class="fi fi-br-search absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-font-light pointer-events-none z-20"></i>
                    <input v-model="searchQuery" type="text" placeholder="Search comments..."
                        class="rounded-full w-full pl-10 pr-4 text-sm text-font bg-fill border-none placeholder:text-font-light h-7" />
                    <!-- Clear search button -->
                    <button v-if="searchQuery" @click="searchQuery = ''"
                        class="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-5 h-5 rounded-full hover:bg-fill-hover"
                        type="button" aria-label="Clear search">
                        <svg class="w-4 h-4 text-font-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Sort dropdown for comments -->
                <div class="relative" @blur="showSortDropdown = false" tabindex="0">
                    <button
                        class="bg-brand px-3 py-1 rounded-full text-xs border border-brand text-font flex items-center gap-2"
                        @click="showSortDropdown = !showSortDropdown" type="button">
                        <i :class="sortOptions.find((opt) => opt.value === sortMode)
                            ?.icon
                            " class="mt-1" />
                        <span>{{
                            sortOptions.find((opt) => opt.value === sortMode)
                                ?.label || "Sort"
                        }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Dropdown menu for sort options -->
                    <div v-if="showSortDropdown"
                        class="absolute z-20 mt-2 bg-fill-light rounded-lg shadow-lg w-48 right-0">
                        <div class="max-h-60 overflow-y-auto">
                            <div v-for="option in sortOptions" :key="option.value"
                                class="flex items-center gap-2 pl-4 py-2 cursor-pointer hover:bg-fill-hover rounded"
                                :class="sortMode === option.value
                                    ? 'bg-brand hover:!bg-brand-hover font-semibold'
                                    : ''
                                    "
                                @click="() => { sortMode = option.value as typeof sortMode.value; showSortDropdown = false; }">
                                <i class="mt-1" :class="option.icon" />
                                <span>{{ option.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comments list or no comments message -->
            <!-- Show loader while comments are loading -->
            <template v-if="isCommentsLoading">
                <div class="flex items-center justify-center py-8">
                    <LoaderComponent />
                </div>
            </template>
            <!-- Show comments if there are any -->
            <template v-else-if="comments.length > 0">
                <template v-for="comment in filteredComments" :key="comment.id">
                    <!-- Single comment component -->
                    <CommentComponent :comment="comment" :all-comments="comments" :post-id="Number(postId)"
                        :hopper-id="Number(userId)" :replies="comments" @refresh="
                            fetchComments();
                        fetchPost();
                        " />
                </template>
            </template>
            <!-- Show message if there are no comments -->
            <template v-else>
                <div class="text-center text-font-light py-8 mb-2">
                    This post has no comments yet.
                </div>
            </template>
        </div>
    </div>

    <!-- Right side: Burrow sidebar info (only on large screens) -->
    <BurrowSidebar v-if="burrow" :burrow="burrow" class="hidden lg:block" />
</div>

<!-- Loader while fetching post data -->
<div v-else class="flex items-center justify-center m-auto min-h-[calc(100vh-150px)] w-full overflow-hidden">
    <LoaderComponent />
</div>
</template>
