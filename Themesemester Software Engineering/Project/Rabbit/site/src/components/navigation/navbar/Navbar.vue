<script lang="ts" setup>
import newPost from "~/components/newPost.vue";
import {
    AvatarComponent as Avatar,
    ButtonComponent as Button,
    IconButton,
} from "#components";
import { useFetchSearch } from "~/utils/fetch/search/useFetchSearch";
import { FileTypes, NotificationTypes, type NotificationItem, type SearchResponse } from "~/assets/customTypes";
import { getFilePath } from "~/utils/file";
import { useAppWebSocket } from "~/composables/useAppWebSocket";
import { getExclusions } from "~/utils/settings";
import { useFetchGetNotifications } from "~/utils/fetch/notification/useFetchGetNotifications";
const userStore = useUserStore();
const { data: wsStream, status: wsStatus } = useAppWebSocket();

// Lifecycle
onMounted(async () => {
    document.addEventListener("click", (event) => {
        const target: HTMLElement = event.target as HTMLElement;
        if (!target.classList.contains("disable-search-close")) inputFocus.value = false;
        if (!target.classList.contains("disable-notification-close")) notificationMenuOpen.value = false;
        if (!target.classList.contains("disable-profile-close")) profilePopover.value = false;
    });

    if (!userStore.isLoggedIn) return;
    notificationStack.value = await useFetchGetNotifications(userStore.user.id);
});

// Reactive Data
const profilePopover: Ref<boolean> = ref(false);
const showModal = ref(false);
const searchQuery: Ref<string> = ref("");
const searchInterval: Ref<null | NodeJS.Timeout> = ref(null);
const searchResults: Ref<SearchResponse | null> = ref(null);
const emptyMessage: Ref<string> = ref("Type in the search bar above, and results will appear here.");
const resultsPerPage: Ref<number> = ref(7);
const offset: Ref<number> = ref(0);
const inputFocus: Ref<boolean> = ref(false);
const rawSearchQuery: Ref<string> = ref("");
const searchScopeOverwrite: Ref<Array<string>> = ref([]);
const loading: Ref<Boolean> = ref(false);
const notificationStack: Ref<Array<NotificationItem>> = ref([]);
const notificationMenuOpen: Ref<boolean> = ref(false);

// HTML Elements
const searchInput: Ref<null | HTMLInputElement> = ref(null);
const loadingIndicator: Ref<null | HTMLImageElement> = ref(null);

// Watchers
watch(() => wsStream.value, (newValue: any) => {
    if (!newValue) return;
    const data: NotificationItem = JSON.parse(newValue as string);
    if (!(data satisfies NotificationItem) || data.type === NotificationTypes.acknowledge) return;

    // Withdraw message that became invalid
    if (data.type.startsWith("buddy")) {
        notificationStack.value = notificationStack.value.filter((notification: NotificationItem) => {
            const directionA = notification.data.buddy_id === data.data.buddy_id && notification.hopper_id === data.hopper_id;
            const directionB = notification.data.buddy_id === data.hopper_id && notification.hopper_id === data.data.buddy_id;
            return !(directionA || directionB);
        });

        // Buddy messages are sent double to update both sides of the transactions.
        if (data.data.buddy_id === userStore.user.id) return;
    }

    if (getExclusions().includes(data.type) || data.is_silent) return;
    notificationStack.value.push(data);
}, { immediate: true });

// Methods

/**
 * Toggles the profile popover
 */
function togglePopover(): void {
    profilePopover.value = !profilePopover.value;
}

/**
* Handle search input focus, also triggering the search interval.
*/
function searchFocusHandler(): void {
    inputFocus.value = true;
    searchInterval.value = setInterval(async () => {
        if (!searchInput.value) return;
        if (!searchInput.value.value.length) {
            searchQuery.value = "";
            return searchResults.value = null;
        };
        await search(false, offset.value);
    }, 1500);
}

/**
 * Handle search input blur, also clearing the search interval.
 * @param event The blur event.
 */
function searchBlurHandler(): void {
    if (!searchInput.value) return;
    if (searchInterval.value) {
        clearInterval(searchInterval.value);
        searchInterval.value = null;
        if (!searchInput.value.value.length) {
            searchQuery.value = "";
            searchResults.value = null;
        }
    }
}

/**
 * Query the search engine.
 * @param force Overwrite the same search query check.
 * @param newOffset The offset to start the search from.
 */
async function search(force: boolean, newOffset: number): Promise<void | SearchResponse> {
    // Setup
    if (!searchInput.value) return;
    if (!searchInputChecks(force, newOffset)) return;
    offset.value = newOffset;
    const searchValue = searchInput.value.value.trim();
    searchQuery.value = searchValue;

    const globalSearch: Array<string> = ["rabbit_burrow", "rabbit_hopper", "rabbit_post"];
    const searchScope: Array<string> = searchScopeOverwrite.value.length ? searchScopeOverwrite.value : globalSearch;

    // Fetch
    const data: string | SearchResponse = await useFetchSearch(searchValue, searchScope, offset.value, resultsPerPage.value);
    if (loadingIndicator.value) loadingIndicator.value.classList.add("invisible");
    loading.value = false;
    if (typeof data === "object") {
        if (data.results.length === 0 && offset.value > 0) return search(false, 0);
        emptyMessage.value = "Type in the search bar above, and results will appear here.";
        return searchResults.value = data;
    } else emptyMessage.value = data;
}

/**
 * Select a scope for the search.
 * This overwrites the default search scopes.
 * @param name The name of the scope to select.
 */
function handleScopeSelect(name: string): void {
    if (searchScopeOverwrite.value.includes(name)) {
        searchScopeOverwrite.value = searchScopeOverwrite.value.filter((scope) => scope !== name);
    } else searchScopeOverwrite.value.push(name);
    search(true, offset.value);
}

/**
 * Handle the search input, and show the loading indicator.
 */
function handleInput(): void {
    if (!loadingIndicator.value) return;
    if (!searchInputChecks(false, offset.value)) return;
    loading.value = true;
    loadingIndicator.value.classList.remove("invisible");
}

/**
 * Handle the keydown event.
 * @param event The keydown event.
 */
function handleDown(event: KeyboardEvent): void {
    if (event.key === "Escape" && searchInput.value) {
        document.documentElement.click();
        searchInput.value.blur();
    };
}

/**
 * Perform several checks before querying the search engine to prevent unnecessary requests.
 * @param force Overwrite the same search query check.
 * @param newOffset The offset to start the search from.
 */
function searchInputChecks(force: boolean, newOffset: number): boolean {
    if (!searchInput.value) return false;
    // Same Value
    if (searchInput.value.value === searchQuery.value && !force && newOffset === offset.value) return false;
    // Zero or one result, and typing more
    if (searchResults.value && searchResults.value.count <= 1 && searchInput.value.value.length > searchQuery.value.length) return false;
    // Empty search
    if (!searchInput.value.value.replace(/ /g, "").length) return false;
    return true;
}

// Computed Properties
const hasUnreadNotifications = computed((): boolean => {
    return notificationStack.value.some((notification: NotificationItem) => !notification.is_read);
});
const sortedNotificationStack = computed((): Array<NotificationItem> => {
    return notificationStack.value.sort((a: NotificationItem, b: NotificationItem) => {
        return (a.is_read ? 1 : 0) - (b.is_read ? 1 : 0);
    });
});

withDefaults(
    defineProps<{
        onnavclick: () => void;
    }>(),
    {});
</script>

<template>
    <span class="z-40 sticky top-0">
        <span class="w-full px-4 py-4 lg:px-8 lg:py-4 !pr-4 flex items-center justify-between gap-2 bg-main">
            <span class="flex flex-row items-center gap-4">
                <IconButton variant="primary" color="fill" size="medium" @click="onnavclick"
                    classname="flex-shrink-0 size-8 lg:size-10 xl:hidden">
                    <i class="fi fi-sr-menu-burger fill-white size-3.5" />
                </IconButton>
                <NuxtLink to="/">
                    <img src="/img/horizontal_logo.svg" class="min-w-fit" />
                </NuxtLink>
            </span>

            <div class="relative hidden sm:flex items-center flex-1 min-w-36 max-w-lg w-full rounded-full flex-col">
                <label for="search" @click="searchInput?.focus()"
                    class="disable-search-close absolute left-4 top-3 text-font-light flex align-center items-center gap-2 text-sm pointer-events-none z-20">
                    <NuxtImg src="/icons/search.svg" class="w-4 h-4" />
                </label>
                <input id="search" ref="searchInput" v-model.trim="rawSearchQuery" type="text" name="search"
                    maxlength="60" @focus="searchFocusHandler" @blur="searchBlurHandler" @input="handleInput"
                    @keydown.esc="handleDown" autocomplete="off" placeholder="Search"
                    class="disable-search-close border border-gray-300 rounded-full z-10 p-2 px-3 text-font bg-fill border-none pl-11 placeholder:text-font-light w-full" />
                <span ref="loadingIndicator" class="absolute right-3 top-3 z-20" :class="{ 'hidden': !loading }">
                    <img src="/icons/settings.svg" class="w-4 h-4 animate-spin" />
                </span>
                <!-- Results Fold-Out -->
                <div class="bg-fill-light rounded w-[97%] absolute top-8 flex flex-col gap-2 box-border p-4 disable-search-close border border-font-light shadow-xl"
                    :class="{ 'min-h-60': searchResults, 'h-14': !searchResults }" v-if="inputFocus">
                    <template v-if="searchResults">
                        <div>
                            <p class="text-sm text-font-light my-2 font-bold disable-search-close">Filter</p>
                            <div class="flex gap-2 disable-search-close">
                                <Button
                                    class="disable-search-close bg-fill h-8 !justify-start !p-0 !px-2 hover:bg-font-light"
                                    title="Toggle this filter"
                                    :class="{ '!bg-brand': searchScopeOverwrite.includes('rabbit_burrow') }"
                                    @click="handleScopeSelect('rabbit_burrow')">
                                    <i class="disable-search-close fi fi-ss-users-alt"></i>
                                    <p class="disable-search-close text-sm">Burrows</p>
                                </Button>
                                <Button
                                    class="disable-search-close bg-fill h-8 !justify-start !p-0 !px-2 hover:bg-font-light"
                                    title="Toggle this filter"
                                    :class="{ '!bg-brand': searchScopeOverwrite.includes('rabbit_hopper') }"
                                    @click="handleScopeSelect('rabbit_hopper')">
                                    <i class="disable-search-close fi fi-ss-user"></i>
                                    <p class="disable-search-close text-sm">Hoppers</p>
                                </Button>
                                <Button
                                    class="disable-search-close bg-fill h-8 !justify-start !p-0 !px-2 hover:bg-font-light"
                                    title="Toggle this filter"
                                    :class="{ '!bg-brand': searchScopeOverwrite.includes('rabbit_post') }"
                                    @click="handleScopeSelect('rabbit_post')">
                                    <i class="disable-search-close fi fi-ss-users-alt"></i>
                                    <p class="disable-search-close text-sm">Posts</p>
                                </Button>
                            </div>
                        </div>
                        <div v-if="searchResults" class="flex flex-col gap-2 disable-search-close">
                            <p class="text-sm text-font-light mt-2 font-bold disable-search-close">Results</p>
                            <div v-for="searchResult in searchResults.results" v-if="searchResults.results.length">
                                <template v-if="searchResult._federation.indexUid === 'rabbit_burrow'">
                                    <NuxtLink :to="`/b/${searchResult.name}`" title="Go to burrow"
                                        class="flex gap-2 items-center">
                                        <Avatar :url="getFilePath(
                                            'Burrow',
                                            FileTypes.burrowAvatar
                                        )" />
                                        <div class="flex flex-col">
                                            <p class="font-semibold text-sm">b/{{ searchResult.name }}</p>
                                            <p class="text-xs text-font-light">{{ searchResult.description }}</p>
                                        </div>
                                    </NuxtLink>
                                </template>
                                <template v-else-if="searchResult._federation.indexUid === 'rabbit_hopper'">
                                    <NuxtLink :to="`/h/${searchResult.username}`" title="Go to hopper"
                                        class="flex gap-2 items-center">
                                        <Avatar :url="getFilePath(
                                            searchResult.avatar,
                                            FileTypes.hopperAvatar
                                        )" />
                                        <p class="font-semibold text-sm">h/{{ searchResult.username }}</p>
                                    </NuxtLink>
                                </template>
                                <template v-if="searchResult._federation.indexUid === 'rabbit_post'">
                                    <NuxtLink :to="`/p/${searchResult.name}`" title="Go to hopper"
                                        class="flex gap-2 items-center">
                                        <Avatar :url="getFilePath(
                                            'Post',
                                            FileTypes.hopperAvatar
                                        )" />
                                        <div>
                                            <p class="font-semibold text-sm">{{ searchResult.title }}</p>
                                            <p class="text-xs text-font-light">{{ searchResult.description }}</p>
                                        </div>
                                    </NuxtLink>
                                </template>
                            </div>
                            <p v-else class="disable-search-close mt-10 text-font-light text-sm text-center">
                                Nothing to be found with this query or filter.
                            </p>
                        </div>
                    </template>
                    <p v-else class="disable-search-close text-font-light pt-1 text-sm text-center">
                        Start typing to see results pouring in!
                    </p>
                </div>
            </div>

            <span class="gap-2 flex flex-shrink-0 flex-row">
                <IconButton classname="sm:hidden" size="medium" color="fill" variant="primary">
                    <i class="fi fi-ss-search"></i>
                </IconButton>
                <ClientOnly>
                    <template v-if="userStore.isLoggedIn">
                        <Button label="Create post" color="orange" size="medium" variant="outline"
                            classname="w-8 [&>p]:hidden [&>p]:md:flex md:w-auto lg:h-10 lg:text-sm"
                            @click="showModal = true">
                            <i class="fi fi-sr-plus size-3.5 before:!leading-[0.875rem]" />
                        </Button>
                        <IconButton variant="primary" color="fill" size="medium" title="Open notification center"
                            @click="notificationMenuOpen = !notificationMenuOpen" class="disable-notification-close"
                            classname="size-8 lg:size-10 flex-shrink-0 lg:h-10 lg:text-sm relative">
                            <i class="fi fi-sr-bell size-3.5 disable-notification-close" />
                            <span v-if="hasUnreadNotifications" title="You have unread notifications"
                                class="rounded-full h-3 w-3 bg-brand absolute bottom-[30px] left-[30px] disable-notification-close"></span>
                            <NotificationMenu :notification-stack="sortedNotificationStack" v-if="notificationMenuOpen">
                            </NotificationMenu>
                        </IconButton>
                        <span @click="togglePopover" class="disable-profile-close relative">
                            <Avatar :url="getFilePath(userStore.user.avatar, FileTypes.hopperAvatar)" title="Open menu"
                                classname="size-8 cursor-pointer [&>svg]:scale-90 lg:size-10 [&>svg]:lg:scale-100 disable-profile-close" />
                            <span :class="wsStatus === 'OPEN' ? 'bg-brand-alt' : 'bg-red-500'"
                                :title="wsStatus === 'OPEN' ? 'You are online' : 'You are offline'"
                                class="rounded-full h-3 w-3 bg-brand-alt absolute bottom-[30px] left-[30px] disable-notification-close"></span>
                        </span>
                    </template>
                    <IconButton v-else variant="primary" color="orange" label="Log in" size="medium"
                        classname="!rounded-full !px-8 lg:h-10 lg:px-4 lg:text-sm font-semibold w-full"
                        @click="navigateTo('/login')" />
                </ClientOnly>
            </span>
        </span>

        <span v-if="profilePopover && userStore.isLoggedIn"
            class="absolute right-4 top-16 bg-fill-light rounded-lg w-64 z-20 shadow-xl disable-profile-close border border-font-light">
            <span class="flex flex-col disable-profile-close">
                <NuxtLink :to="`/h/${userStore.user.username}`"
                    class="flex flex-row items-center gap-2 p-3 hover:bg-fill-hover active:bg-fill-active rounded-t-lg">
                    <Avatar classname="flex-shrink-0"
                        :url="getFilePath(userStore.user.avatar, FileTypes.hopperAvatar)" />
                    <span class="flex flex-col w-full overflow-hidden">
                        <p class="text-white font-medium text-sm truncate">Profile</p>
                        <p class="text-gray-500 font-light text-xs truncate">
                            h/{{ userStore.user.username }}
                        </p>
                    </span>
                </NuxtLink>

                <NuxtLink :to="`/h/${userStore.user.username}?view=buddies`"
                    class="flex flex-row items-center gap-3 px-4 py-3 hover:bg-fill-hover">
                    <i class="fi fi-ss-users-alt size-3.5" />
                    <span class="text-white font-medium text-sm truncate">Buddies</span>
                </NuxtLink>

                <NuxtLink to="/settings" title="Go to settings"
                    class="flex flex-row items-center gap-3 px-4 py-3 hover:bg-fill-hover">
                    <i class="fi fi-sr-settings size-3.5" />
                    <p>Settings</p>
                </NuxtLink>

                <NuxtLink to="/admin" title="Go to the Admin panel" v-if="userStore.isAdmin"
                    class="flex flex-row items-center gap-3 px-4 py-3 hover:bg-fill-hover">
                    <i class="fi fi-sr-crown size-3.5" />
                    <p>Admin Panel</p>
                </NuxtLink>

                <NuxtLink to="/" title="Sign out" @click="userStore.signOut"
                    class="flex flex-row items-center gap-3 px-4 py-3 hover:bg-fill-hover rounded-b-lg">
                    <i class="fi fi-sr-sign-out-alt size-3.5" />
                    <p>Sign Out</p>
                </NuxtLink>
            </span>
        </span>
        <newPost v-if="showModal" :open="showModal" @close="showModal = false" />
    </span>
</template>
