<script setup lang="ts">
import { ref, computed } from "vue";
import JoinComponent from "~/components/JoinComponent.vue";
import Callout from "~/components/admin/components/Callout.vue";
import { useFetchPosts } from "~/utils/fetch/post/useFetchPosts";
import { useFetchBurrow } from "~/utils/fetch/burrow/useFetchBurrow";
import { FileTypes, ToastTypes, type ToastItem } from "~/assets/customTypes";
import EditBurrow from "~/components/EditBurrow.vue";
import { useFetchBurrowMemberStatus } from "~/utils/fetch/burrow/useFetchBurrowMemberStatus";
import { useDeleteBurrow } from "~/utils/fetch/admin/deleteBurrow";

// Page meta configuration
definePageMeta({
    path: "/b/:name",
});

// Composables and stores
const { $event } = useNuxtApp();
const userStore = useUserStore();
const burrowStore = useburrowSideBar();
const showDeleteModal = ref(false);

// Reactive data
const member = ref(false);
const selectedTag = ref<string | null>(null);
const showModal = ref(false);
const showTagDropdown = ref(false);
const burrowError = ref<string | null>(null);

// Computed properties
const userLoggedIn = computed(() => userStore.isLoggedIn);
const hopperId = computed(() => userStore.user.id);
const viewerId = computed(() => userStore.user?.id ?? null);

// Available tags for filtering posts
const availableTags = computed(() => {
    const tags = new Map<string, string>();
    posts.value.forEach((p) => {
        if (p.label?.name && p.label?.color) {
            tags.set(p.label.name, p.label.color);
        }
    });
    return Array.from(tags.entries()).map(([name, color]) => ({ name, color }));
});

// Filter posts by selected tag
const filteredPosts = computed(() =>
    selectedTag.value
        ? posts.value.filter((p) => p.label?.name === selectedTag.value)
        : posts.value,
);

// Menu option type
type Option = {
    label: string;
    icon: string;
    value: string;
    style?: string;
};

// Computed options for the burrow menu
const options = computed<Option[]>(() => {
    const isOwner = userStore.user.id === burrow.value?.ownerId;

    if (isOwner) {
        return [
            { label: "Edit", icon: "fi fi-sr-pencil", value: "edit" },
            {
                label: "Delete",
                icon: "fi fi-sr-trash-xmark",
                style: "color: red",
                value: "delete",
            },
        ];
    }

    return [{ label: "Report", icon: "fi fi-sr-flag-alt", value: "report" }];
});

// Fetch composables
const { burrow, burrowId, fetchBurrow } = useFetchBurrow();
const { activeSort, posts, isLoading, loadInitialPosts, changeSort } =
    useFetchPosts({ burrowId, hopperId, viewerId });


// Fetch the burrow data and handle errors
onMounted(async () => {
    try {
        // Initial data loading
        await fetchBurrow();
        await loadInitialPosts();

        // Check if the user is logged in and fetch their membership status
        if (userStore.isLoggedIn && burrow.value?.id && userStore.user?.id) {
            member.value = await useFetchBurrowMemberStatus(
                burrow.value.id,
                userStore.user.id,
            );
        }

        // Add burrow to the sidebar store for quick access
        burrowStore.addBurrowToSidebar({
            name: burrow.value?.name ?? "",
            avatar: burrow.value?.avatar ?? "",
        });

        if (!burrow.value) {
            burrowError.value = "This burrow does not exist.";
        }
    } catch (e) {
        burrowError.value = "Failed to load burrow.";
    }
});

/**
 * Handles the action selected from the options menu.
 * @param action The action selected by the user.
 * This can be "edit", "report", or "delete".
 */
function handleMenuAction(action: string) {
    switch (action) {
        case "edit":
            showModal.value = true;
            break;
        case "report":
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message:
                    "Thank you for reporting this burrow. Our moderators will review it shortly.",
                duration: 3,
            } as ToastItem);
            break;
        case "delete":
            showDeleteModal.value = true;
            break;
        default:
            console.log("Unknown action:", action);
    }
}

/**
 * Submits the delete request for the burrow.
 * Handles success and error cases.
 * @returns {Promise<void>}
 */
async function submitDelete(): Promise<void> {
    try {
        await useDeleteBurrow(burrow.value?.name || "");
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.success,
            message: `Burrow has been deleted successfully.`,
            duration: 3,
        } as ToastItem);
        showDeleteModal.value = false;
        await fetchBurrow();
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Failed to delete burrow. Please try again.",
            duration: 3,
        } as ToastItem);
    }
}
</script>

<template>
<div>
    <!-- Show error if burrow not found -->
    <div v-if="burrowError" class="flex justify-center max-w-5xl mx-auto px-4">
        <Callout title="Burrow Not Found" :description="burrowError" variant="warning" />
    </div>
    <!-- Show banned message if burrow is banned -->
    <div v-else-if="burrow && burrow.is_banned" class="flex justify-center max-w-5xl mx-auto px-4">
        <Callout title="Burrow Banned" description="This burrow has been banned." variant="warning" />
    </div>

    <!-- Show deleted message if burrow is deleted -->
    <div v-else-if="burrow && burrow.date_deleted" class="flex justify-center max-w-5xl mx-auto px-4">
        <Callout title="Burrow Deleted" description="This burrow has been deleted." variant="error" />
    </div>
    <!-- Main burrow content if burrow exists and is not banned -->
    <div v-else-if="burrow"
        class="flex flex-col lg:flex-row justify-center items-start w-full gap-4 pt-0 lg:px-4 lg:pr-0">
        <!-- Main Content Column -->
        <div class="flex-1 flex flex-col gap-5 w-full max-w-5xl mx-auto">
            <!-- Burrow header with banner, avatar, name, join button, and options menu -->
            <div class="bg-fill rounded-xl p-4 pb-6 w-full flex flex-col gap-4">
                <!-- Banner placeholder -->
                <div class="h-36 w-full bg-fill-light rounded-xl"></div>
                <div class="flex justify-between items-center gap-4 sm:gap-0 flex-wrap">
                    <div class="flex gap-4 items-center">
                        <!-- Burrow avatar -->
                        <img :src="getFilePath(
                            burrow.avatar,
                            FileTypes.burrowAvatar,
                        )
                            " class="size-20 ml-8 -mt-12 z-10 bg-fill rounded-full outline outline-4 outline-fill" />
                        <!-- Burrow name -->
                        <h1 class="text-2xl font-bold">
                            b/{{ burrow.name }}
                        </h1>
                        <span v-if="burrow.is_nsfw_allowed"
                            class="inline-flex items-center mt-2 gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-600 text-font">
                            <i class="fi fi-ss-age-restriction-eighteen"></i>
                            NSFW
                        </span>
                    </div>
                    <!-- Join Button & Options Menu (only if user is logged in) -->
                    <div v-if="userLoggedIn" class="flex gap-2 justify-end items-center flex-1">
                        <JoinComponent v-if="userLoggedIn" :class="member
                            ? '!bg-fill-light hover:!bg-fill-light-hover'
                            : ''
                            " :burrow-id="burrow.id" :hopper-id="userStore.user.id" :member="member"
                            @update:member="member = $event" />

                        <OptionsMenu :options="options" @select="handleMenuAction" />
                    </div>
                </div>
            </div>

            <!-- Sorting and tag filter bar -->
            <div class="text-sm bg-fill justify-between items-center h-10 w-full rounded-full p-3 pl-6 flex">
                <!-- Sorting options -->
                <div class="flex gap-5">
                    <p v-for="option in ['trending', 'new']" :key="option" class="cursor-pointer capitalize" :class="option === activeSort
                        ? 'text-font font-semibold'
                        : 'text-font-light'
                        " @click="changeSort(option as 'trending' | 'new')">
                        {{ option }}
                    </p>
                </div>

                <!-- Tag filter dropdown -->
                <div class="relative" tabindex="0" @blur="showTagDropdown = false">
                    <button
                        class="px-3 py-1 rounded-full text-xs border text-font-light border-fill-light hover:border-brand hover:text-brand flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-fill-light disabled:hover:text-font-light"
                        type="button" :disabled="availableTags.length === 0" :style="selectedTag
                            ? `background-color: #${availableTags.find((t) => t.name === selectedTag)?.color}; color: white; border-color: #${availableTags.find((t) => t.name === selectedTag)?.color}`
                            : ''
                            " @click="showTagDropdown = !showTagDropdown">
                        <i class="fi fi-sr-label"></i>
                        <span>{{ selectedTag || "Filter by tag" }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <!-- Tag dropdown list -->
                    <div v-if="showTagDropdown"
                        class="absolute z-10 mt-2 bg-fill-light rounded-lg shadow-lg w-48 right-0">
                        <div class="max-h-60 overflow-y-auto">
                            <label v-for="tag in availableTags" :key="tag.name"
                                class="flex items-center gap-2 pl-4 py-2.5 cursor-pointer hover:bg-fill-hover rounded"
                                :style="selectedTag === tag.name
                                    ? `background-color: #${tag.color}`
                                    : ''
                                    ">
                                <input type="radio" class="hidden" :checked="selectedTag === tag.name" @click="
                                    selectedTag =
                                    selectedTag === tag.name
                                        ? null
                                        : tag.name;
                                showTagDropdown = false;
                                " @change.prevent />
                                <span>{{ tag.name }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Posts list -->
            <div class="w-full 2xl:max-w-4xl m-auto md:mt-0 flex flex-col gap-3 mb-8">
                <!-- Render each post -->
                <PostComponent v-for="post in filteredPosts" :key="post.id" v-bind="post" :burrow-hidden="true"
                    :join-hidden="true" @refresh="loadInitialPosts" />
                <!-- Loader when posts are loading -->
                <div v-if="isLoading" class="flex justify-center items-center mt-4">
                    <LoaderComponent />
                </div>
                <!-- Message if no posts found -->
                <p v-if="!isLoading && posts.length === 0" class="text-center text-font-light mt-4">
                    No posts found.
                </p>
            </div>
        </div>

        <!-- Aside Sidebar with burrow info -->
        <BurrowSidebar :burrow="burrow" />
        <!-- Edit burrow modal -->
        <EditBurrow :open="showModal" :burrow="burrow" :burrow-id="burrowId ?? 0" @close="
            showModal = false;
        fetchBurrow();
        " />
    </div>

    <!-- Modal Overlay Background -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-60 z-40" @click.self="showDeleteModal = false">
    </div>

    <!-- Deletion Modal -->
    <div v-if="showDeleteModal"
        class="fixed inset-0 size-fit rounded-xl m-auto z-50 text-font flex flex-col items-center justify-center bg-fill p-6 max-w-xl w-auto shadow-xl">
        <div>
            <!-- Close Button (top right) -->
            <button class="absolute top-2 right-2 text-xl text-font-light hover:text-font"
                @click="showDeleteModal = false" aria-label="Close">
                <i class="fi fi-sr-cross-small"></i>
            </button>
        </div>
        <div class="flex flex-col items-center mb-4 w-full">
            <p class="text-xl text-center font-semibold mb-4">Delete your burrow?</p>
            <BurrowSidebar v-if="burrow" :burrow="burrow" :is-preview="true" />
        </div>

        <!-- Deletion Modal Buttons -->
        <div class="flex flex-col gap-4 w-full text-center">
            <div class="flex gap-2 w-full">
                <button class="px-4 flex-1 py-2 border border-fill-light text-font rounded-full hover:bg-fill-light"
                    @click="showDeleteModal = false">
                    Cancel
                </button>
                <button class="px-4 flex-1 py-2 bg-brand-negative text-font rounded-full hover:bg-red-700"
                    @click="submitDelete()">
                    Confirm
                </button>
            </div>
            <p class="text-font-light text-sm">Once deleted, there is no going back!</p>
        </div>
    </div>
</div>
</template>
