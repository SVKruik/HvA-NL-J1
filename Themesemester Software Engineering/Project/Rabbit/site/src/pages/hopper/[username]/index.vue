<script setup lang="ts">
import { useRoute, navigateTo } from "#app";
import Button from "~/components/ButtonComponent.vue";
import { useFetchPosts } from "~/utils/fetch/post/useFetchPosts";
import {
    type Buddy,
    FileTypes,
    NotificationTypes,
    ToastTypes,
    type BuddyStatus,
    type NotificationItem,
} from "~/assets/customTypes";
import { useFetchHopper } from "~/utils/fetch/hopper/useFetchHopper";
import HopperSidebar from "~/components/HopperSidebar.vue";
import { useFetchCommentsByUser } from "~/utils/fetch/comments/useFetchCommentsByUser";
import { useFetchBuddyRequest } from "~/utils/fetch/buddy/useFetchBuddyRequest";
import { useFetchBuddyAccept } from "~/utils/fetch/buddy/useFetchBuddyAccept";
import { useFetchBuddies } from "~/utils/fetch/buddy/useFetchBuddies";
import Callout from "~/components/admin/components/Callout.vue";
import CommentComponent from "~/components/CommentComponent.vue";

// Page meta configuration
definePageMeta({ path: "/h/:username" });

// Composables and stores
const route = useRoute();
const userStore = useUserStore();
const { data: wsStream } = useAppWebSocket();
const { $event } = useNuxtApp();

// Reactive data
const isBuddyLoading = ref(false);
const isCommentsLoading = ref(true);
const selectedView = ref<"posts" | "comments" | "upvoted" | "buddies">("posts");
const showViewDropdown = ref(false);
const username = ref(route.params.username as string | null);
const isCurrentUser = computed(
    () => userStore.user?.username === username.value,
);
const currentBuddyStatus = ref<Buddy>();

// Buddy Search variables
const buddySearch = ref("");
const filteredBuddies = computed(() => {
    let filtered = buddies.value;

    if (buddySearch.value.trim()) {
        filtered = filtered.filter((b) =>
            b.username
                .toLowerCase()
                .includes(buddySearch.value.trim().toLowerCase()),
        );
    }

    // Sort by is_favorite first (favorites at top), then by username
    return filtered.sort((a, b) => {
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
        return a.username.localeCompare(b.username);
    });
});

// Hopper data
const { hopper, hopperId, fetchHopper, buddyStatus } = useFetchHopper(
    username.value || "",
    userStore.user?.id,
);
const hopperError = ref<string | null>(null);

// View from query param
const viewParam = route.query.view as string;
if (["posts", "comments", "upvoted", "buddies"].includes(viewParam)) {
    selectedView.value = viewParam as typeof selectedView.value;
}

// Hopper ID and options for posts
const praisedOnly = computed(() => selectedView.value === "upvoted");
const rawViewerId = Number(userStore.user?.id);
const viewerId = ref<typeof rawViewerId | null>(
    typeof rawViewerId === "number" && !isNaN(rawViewerId) ? rawViewerId : null,
);
const postsOptions = { username, hopperId, praisedOnly, viewerId };

// Buddies
const { buddies, fetchBuddies } = useFetchBuddies(
    username.value ?? "",
    viewerId.value ?? undefined,
);

// Initial fetch for hopper and buddies
try {
    await fetchHopper();
    if (!hopper.value) {
        hopperError.value = "Hopper not found.";
    } else if (viewerId.value !== undefined) {
        await fetchBuddies();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
} catch (error: any) {
    hopperError.value = "Failed to fetch hopper.";
}

// Posts and Comments
const { activeSort, posts, isLoading, loadInitialPosts, changeSort } =
    useFetchPosts(postsOptions);
const { comments, fetchComments } = useFetchCommentsByUser(
    Number(hopperId.value),
    viewerId.value ?? undefined,
);

// Function to fetch data based on the selected view
const fetchViewData = async (view: typeof selectedView.value) => {
    if (view === "comments") {
        isCommentsLoading.value = true;
        await fetchComments();
        isCommentsLoading.value = false;
    } else if (view === "buddies") {
        await fetchBuddies();
    } else if (view === "posts") {
        await loadInitialPosts();
    }
};

// Fetch initial data based on the selected view
onMounted(() => {
    fetchViewData(selectedView.value);
});

// Watch for changes in the buddy status and fetch buddy data accordingly
watch(
    () => wsStream.value,
    async (newValue: any) => {
        if (!newValue) return;
        const data: NotificationItem = JSON.parse(newValue as string);

        // Refresh buddies on buddy-related notifications
        await fetchBuddies();
        currentBuddyStatus.value = buddies.value.find(
            (b) => b.id === userStore.user?.id,
        );

        if (!(data satisfies NotificationItem) || data.type === "ack") return;
        if (
            data.type.startsWith("buddy") &&
            data.data.buddy_id !== hopperId.value &&
            data.data.buddy_id !== userStore.user?.id
        )
            return;

        switch (data.type) {
            case NotificationTypes.buddyNew:
                buddyStatus.value = {
                    has_connection: true,
                    is_accepted: false,
                    is_incoming: true,
                };
                break;
            case NotificationTypes.buddyAccepted:
                buddyStatus.value = {
                    has_connection: true,
                    is_accepted: true,
                    is_incoming: false,
                };
                break;
            case NotificationTypes.buddyRemoved:
            case NotificationTypes.buddyDeclined:
                buddyStatus.value = {
                    has_connection: false,
                    is_accepted: false,
                    is_incoming: false,
                };
                break;
        }
    },
    { immediate: true },
);

/**
 * Updates the selected view and fetches the corresponding data.
 * @param view - The view to switch to (posts, comments, upvoted, buddies).
 * @return {Promise<void>}
 */
async function updateView(view: typeof selectedView.value): Promise<void> {
    selectedView.value = view;
    showViewDropdown.value = false;
    const query = { ...route.query, view };
    navigateTo({ path: route.path, query }, { replace: true });
    await fetchViewData(view);
}

// Watch for changes in the route query to update the view
watch(
    () => route.query.view,
    async (newView) => {
        if (
            ["posts", "comments", "upvoted", "buddies"].includes(
                newView as string,
            ) &&
            newView !== selectedView.value
        ) {
            await updateView(newView as typeof selectedView.value);
        }
    },
);

/**
 * Handles buddy requests (add, accept, decline, remove).
 * @param mode - true to send a request, false to remove or decline.
 * @param targetHopperId - The ID of the hopper to send the request to or perform the action on.
 * @return {Promise<void>}
 */
async function handleBuddyRequest(
    mode: boolean,
    targetHopperId: number,
): Promise<void> {
    if (isBuddyLoading.value) return;
    isBuddyLoading.value = true;

    try {
        if (!targetHopperId || !userStore.user?.id)
            throw new Error("You must be logged in to perform this action.");

        let currentStatus: BuddyStatus;

        if (targetHopperId === hopperId.value) {
            currentStatus = buddyStatus.value;
        } else {
            const buddyInList = buddies.value.find(
                (b) => b.id === targetHopperId,
            );
            if (!buddyInList) {
                throw new Error(
                    "Could not find the specified buddy to perform the action.",
                );
            }
            currentStatus = {
                has_connection: true,
                is_accepted: !!buddyInList.isAccepted,
                is_incoming: !!buddyInList.isIncoming,
            };
        }

        let newStatus: BuddyStatus;

        if (!currentStatus.has_connection) {
            newStatus = await useFetchBuddyRequest(
                userStore.user.id,
                targetHopperId,
                "add",
            );
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.success,
                message: "Buddy request sent.",
                duration: 4,
            });
        } else if (currentStatus.is_accepted) {
            newStatus = await useFetchBuddyRequest(
                userStore.user.id,
                targetHopperId,
                "remove",
            );
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.warning,
                message: "You have unfriended this Hopper.",
                duration: 3,
            });
        } else if (currentStatus.is_incoming) {
            if (mode) {
                newStatus = await useFetchBuddyAccept(
                    userStore.user.id,
                    targetHopperId,
                    "accept",
                );
                $event("emit-toast", {
                    id: createTicket(4),
                    type: ToastTypes.success,
                    message: "You are now Buddies!",
                    duration: 4,
                });
            } else {
                newStatus = await useFetchBuddyAccept(
                    userStore.user.id,
                    targetHopperId,
                    "decline",
                );
                $event("emit-toast", {
                    id: createTicket(4),
                    type: ToastTypes.warning,
                    message: "Buddy request declined.",
                    duration: 3,
                });
            }
        } else {
            // Outgoing request
            newStatus = await useFetchBuddyRequest(
                userStore.user.id,
                targetHopperId,
                "remove",
            );
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.info,
                message: "Buddy request cancelled.",
                duration: 3,
            });
        }

        if (targetHopperId === hopperId.value) {
            buddyStatus.value = newStatus;
        } else {
            if (!newStatus.has_connection) {
                buddies.value = buddies.value.filter(
                    (b) => b.id !== targetHopperId,
                );
            } else if (newStatus.is_accepted) {
                const buddyToUpdate = buddies.value.find(
                    (b) => b.id === targetHopperId,
                );
                if (buddyToUpdate) {
                    buddyToUpdate.isAccepted = true;
                    buddyToUpdate.isPending = false;
                    buddyToUpdate.isIncoming = false;
                }
            }
        }
    } catch (error: any) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: error.message || "Something went wrong. Please try again.",
            duration: 3,
        });
    } finally {
        isBuddyLoading.value = false;
    }
}

// Menu options for the Hopper profile
const menuOptions = [
    ...(isCurrentUser.value
        ? [{ label: "Edit", icon: "fi fi-sr-pencil", value: "edit" }]
        : []),
    { label: "Report", icon: "fi fi-sr-flag-alt", value: "report" },
];

// View options for the Hopper profile
type ViewOption = {
    value: string;
    label: string;
    icon: string;
};

const viewOptions: ViewOption[] = [
    { value: "posts", label: "Posts", icon: "fi fi-sr-comment-alt-dots" },
    { value: "comments", label: "Comments", icon: "fi fi-sr-comment-dots" },
    { value: "upvoted", label: "Upvoted Posts", icon: "fi fi-sr-up" },
    { value: "buddies", label: "Buddies", icon: "fi fi-sr-users" },
];

/**
 * Handles the action selected from the options menu.
 * @param action The action selected by the user.
 * 
 */
function handleMenuAction(action: string) {
    switch (action) {
        case "edit":
            navigateTo(`/settings/profile`);
            break;
        case "report":
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message:
                    "Thank you for reporting this Hopper. Our moderators will review it shortly.",
                duration: 3,
            });
            break;
        default:
            console.log("Unknown action:", action);
            return false;
    }
}
</script>

<template>
<div>
    <div v-if="hopperError" class="flex justify-center max-w-5xl mx-auto px-4">
        <Callout title="Hopper Not Found" :description="hopperError" variant="warning" />
    </div>
    <div v-if="hopper?.is_banned" class="flex justify-center max-w-5xl mx-auto px-4">
        <Callout title="Hopper is banned" description="This Hopper has been banned from the platform."
            variant="warning" />
    </div>
    <div v-else-if="hopper"
        class="flex flex-col lg:flex-row justify-center items-start w-full gap-4 pt-0 lg:px-4 lg:pr-0">
        <!-- Main Content -->
        <div class="flex-1 flex flex-col gap-5 w-full max-w-5xl mx-auto">
            <div class="bg-fill rounded-xl p-4 pb-6 w-full flex flex-col gap-4">
                <div class="h-36 w-full bg-fill-light rounded-xl overflow-hidden flex items-center justify-center">
                    <img :src="getFilePath(
                        hopper?.banner,
                        FileTypes.hopperBanner,
                    )
                        " class="w-full h-full object-cover" alt="Banner" :hidden="!hopper?.banner" @error="
                            (e: Event) => {
                                if (e.target) {
                                    (e.target as HTMLImageElement).hidden =
                                        true;
                                }
                            }
                        " />
                </div>
                <div class="flex justify-between items-center gap-4 sm:gap-0 flex-wrap">
                    <div class="flex gap-4 items-center">
                        <img :src="getFilePath(
                            hopper?.avatar,
                            FileTypes.hopperAvatar,
                        )
                            " class="size-20 ml-8 -mt-12 bg-fill rounded-full outline outline-4 outline-fill" @error="
                                (e: Event) => {
                                    if (e.target)
                                        (e.target as HTMLImageElement).src =
                                            fallbackImage(
                                                FileTypes.hopperAvatar,
                                            );
                                }
                            " />
                        <h1 class="text-2xl font-bold">
                            h/{{ hopper?.username }}
                        </h1>
                        <ClientOnly>
                            <Button v-if="isCurrentUser" label="Edit" classname="px-4 font-semibold -mb-2 -ml-2"
                                variant="outline" rounded size="medium" @click="handleMenuAction('edit')" />
                        </ClientOnly>
                    </div>

                    <!-- Buddy CRUD Buttons & Options Menu -->
                    <div class="flex gap-2 justify-end items-center flex-1">
                        <ClientOnly>
                            <template v-if="
                                !isCurrentUser &&
                                userStore.isLoggedIn &&
                                hopperId
                            ">
                                <!-- No Buddy Connection Yet -->
                                <Button v-if="!currentBuddyStatus" label="Become Buddy" :disabled="isBuddyLoading"
                                    rounded size="medium" title="Send a Buddy invitation to this Hopper." @click="
                                        handleBuddyRequest(true, hopperId)
                                        " />

                                <!-- Incoming Pending Requests -->
                                <div v-else-if="
                                    currentBuddyStatus &&
                                    !currentBuddyStatus.isAccepted &&
                                    currentBuddyStatus.isIncoming
                                " class="flex items-center gap-2">
                                    <Button label="Accept Request" title="Accept the request and become Buddies."
                                        rounded size="medium" :disabled="isBuddyLoading" @click="
                                            handleBuddyRequest(
                                                true,
                                                hopperId,
                                            )
                                            " />
                                    <Button label="Decline Request" title="Decline the Buddy invitation."
                                        variant="outline" rounded size="medium" :disabled="isBuddyLoading" @click="
                                            handleBuddyRequest(
                                                false,
                                                hopperId,
                                            )
                                            " />
                                </div>

                                <!-- Outgoing Pending Requests -->
                                <Button v-else-if="
                                    currentBuddyStatus &&
                                    !currentBuddyStatus.isAccepted
                                " label="Cancel Request" :disabled="isBuddyLoading" rounded size="medium"
                                    title="Buddy request sent. Awaiting response. Click to cancel." variant="outline"
                                    @click="
                                        handleBuddyRequest(false, hopperId)
                                        " />

                                <!-- Accepted Buddies -->
                                <Button v-else-if="
                                    currentBuddyStatus &&
                                    currentBuddyStatus.isAccepted
                                " label="Unfriend" :disabled="isBuddyLoading" rounded size="medium"
                                    title="You are Buddies! Click to unfriend." variant="outline" @click="
                                        handleBuddyRequest(false, hopperId)
                                        " />

                                <OptionsMenu :options="menuOptions" @select="handleMenuAction" />
                            </template>
                        </ClientOnly>
                    </div>
                </div>
            </div>

            <!-- View Selector -->
            <div class="text-sm bg-fill justify-between items-center h-10 w-full rounded-full p-3 pl-6 flex gap-5">
                <div>
                    <div v-if="selectedView !== 'posts'" class="text-font font-semibold">
                        {{
                            viewOptions.find(
                                (opt: ViewOption) => opt.value === selectedView,
                            )?.label || selectedView
                        }}
                    </div>
                    <div v-else class="flex gap-5">
                        <div v-for="option in ['trending', 'new']" :key="option"
                            class="w-full cursor-pointer capitalize" :class="option === activeSort
                                ? 'text-font font-semibold'
                                : 'text-font-light'
                                " @click="
                                    changeSort(option as 'trending' | 'new')
                                    ">
                            {{ option }}
                        </div>
                    </div>
                </div>
                <div class="relative" tabindex="0" @blur="showViewDropdown = false">
                    <button class="px-3 py-1 rounded-full text-xs border border-brand text-font flex items-center gap-2"
                        :class="{ 'bg-brand': selectedView }" type="button"
                        @click="showViewDropdown = !showViewDropdown">
                        <i v-if="
                            viewOptions.find(
                                (opt: ViewOption) => opt.value === selectedView,
                            )
                        " :class="viewOptions.find(
                            (opt: ViewOption) => opt.value === selectedView,
                        )?.icon
                            " class="mt-1" />
                        <span>
                            {{
                                viewOptions.find(
                                    (opt: ViewOption) => opt.value === selectedView,
                                )?.label || "Select view"
                            }}
                        </span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <!-- Dropdown Menu -->
                    <div v-if="showViewDropdown"
                        class="absolute z-20 mt-2 bg-fill-light rounded-lg shadow-lg w-48 right-0">
                        <div class="max-h-60 overflow-y-auto">
                            <div v-for="option in viewOptions" :key="option.value"
                                class="flex items-center gap-2 pl-4 py-2 cursor-pointer hover:bg-fill-hover rounded"
                                :class="selectedView === option.value
                                    ? 'bg-brand hover:!bg-brand-hover font-semibold'
                                    : ''
                                    " @click="
                                        updateView(
                                            option.value as
                                            | 'posts'
                                            | 'comments'
                                            | 'upvoted'
                                            | 'buddies',
                                        )
                                        ">
                                <i class="mt-1" :class="option.icon" />
                                <span>{{ option.label }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Dynamic View Content -->
            <ClientOnly>
                <div class="w-full 2xl:max-w-4xl m-auto md:mt-0 flex flex-col gap-3 mb-8">
                    <!-- Posts -->
                    <template v-if="selectedView === 'posts'">
                        <PostComponent v-for="post in posts" :key="post.id" v-bind="post" :username-hidden="true"
                            :join-hidden="true" @refresh="loadInitialPosts" />
                        <div v-if="isLoading" class="flex justify-center items-center mt-4">
                            <LoaderComponent />
                        </div>
                        <p v-if="!isLoading && posts.length === 0" class="text-center text-font-light mt-4">
                            No posts found.
                        </p>
                    </template>

                    <!-- Comments -->
                    <template v-else-if="selectedView === 'comments'">
                        <div v-if="isCommentsLoading" class="flex justify-center items-center mt-4">
                            <LoaderComponent />
                        </div>
                        <template v-else-if="comments && comments.length > 0">
                            <CommentComponent v-for="comment in comments" :key="comment.id" :comment="comment"
                                :all-comments="comments" :post-id="comment.postId" :hopper-id="Number(hopperId)"
                                :show-burrow="true" @refresh="fetchComments()" />
                        </template>
                        <p v-else class="text-center text-font-light mt-4">
                            This hopper hasn't made any comments yet.
                        </p>
                    </template>

                    <!-- Upvoted Posts -->
                    <template v-else-if="selectedView === 'upvoted'">
                        <PostComponent v-for="post in posts" :key="post.id" v-bind="post" :join-hidden="true" />
                        <div v-if="isLoading" class="flex justify-center items-center mt-4">
                            <LoaderComponent />
                        </div>
                        <p v-if="!isLoading && posts.length === 0" class="text-center text-font-light mt-4">
                            This hopper hasn't upvoted any posts yet.
                        </p>
                    </template>

                    <!-- Buddies -->
                    <template v-else-if="selectedView === 'buddies'">
                        <div class="flex flex-col gap-4 w-full">
                            <!-- Searchbar -->
                            <div v-if="
                                buddies.length > 0 &&
                                buddies.some(
                                    (buddy: Buddy) => buddy.isAccepted,
                                )
                            " class="relative flex items-center">
                                <i
                                    class="fi fi-br-search absolute left-4 w-4 h-4 text-font-light pointer-events-none z-20"></i>
                                <input v-model="buddySearch" type="text" placeholder="Search buddies..."
                                    class="disable-search-close rounded-full z-10 p-2 px-5 pl-11 text-sm text-font bg-fill border-none placeholder:text-font-light w-full" />
                                <button v-if="buddySearch" @click="buddySearch = ''"
                                    class="absolute right-4 z-20 flex items-center justify-center w-5 h-5 rounded-full hover:bg-fill-hover"
                                    type="button" aria-label="Clear search">
                                    <svg class="w-4 h-4 text-font-light" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div v-if="filteredBuddies.length === 0" class="text-center text-font-light mt-4">
                                <span v-if="buddySearch">No buddies found for your search.</span>
                                <span v-else>This hopper has no buddies yet.</span>
                            </div>
                            <div v-else class="flex flex-col gap-2 w-full">
                                <div v-for="buddy in filteredBuddies" :key="buddy.id" class="w-full">
                                    <BuddyCardComponent :buddy="buddy" :is-current-user="isCurrentUser"
                                        :is-buddy-loading="isBuddyLoading" :handle-buddy-request="handleBuddyRequest
                                            " />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </ClientOnly>
        </div>

        <!-- Aside Sidebar -->
        <HopperSidebar :hopper="hopper" />
    </div>
</div>
</template>
