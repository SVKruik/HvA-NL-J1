<script setup lang="ts">
import {
    ButtonComponent as Button,
    IconButton,
} from "#components";
import {
    FileTypes,
    PostTypes,
    ToastTypes,
    type PostComponentProps,
    type ToastItem,
} from "~/assets/customTypes";
import { formatNumber } from "../utils/format";
import OptionsMenu from "./OptionsMenu.vue";
import BirthdayComponent from "./BirthdayComponent.vue";
import PraiseComponent from "./PraiseComponent.vue";
import { useFetchPostDelete } from "~/utils/fetch/post/useFetchPostDelete";

// Composables and stores
const { $event } = useNuxtApp();
const userStore = useUserStore();
const userLoggedIn = computed(() => userStore.isLoggedIn);
const isOwnPost = computed(() => userStore.user?.username === props.username);
const props = defineProps<PostComponentProps>();
const emit = defineEmits<{
    (e: 'refresh'): void;
    (e: 'delete'): void;
}>();

// Reactive data
const upvotes: Ref<number> = ref(props.upvotes ?? 0);
const comments: Ref<number> = ref(props.comments ?? 0);
const member: Ref<boolean> = ref(props.member ?? false);
const showContent: Ref<boolean> = ref(false);
const showModal: Ref<boolean> = ref(false);
const deleteConfirm: Ref<boolean> = ref(false);
const isVisible: Ref<boolean> = ref(true);
const showEditModal = ref(false);
const showImageModal = ref(false);

// Custom video control state
const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(true);
const currentTime = ref(0);
const duration = ref(0);
const muted = ref(true);

/**
 * Toggles the play/pause state of the video.
 * If the video is currently playing, it will be paused and vice versa.
 * @returns {void}
 */
function togglePlay(): void {
    if (!videoRef.value) return;
    if (videoRef.value.paused) {
        videoRef.value.play();
        isPlaying.value = true;
    } else {
        videoRef.value.pause();
        isPlaying.value = false;
    }
}

/**
 * Toggles the mute state of the video.
 * If the video is currently muted, it will be unmuted and vice versa.
 * @returns {void}
 */
function toggleMute(): void {
    if (!videoRef.value) return;
    videoRef.value.muted = !videoRef.value.muted;
    muted.value = videoRef.value.muted;
}
/**
 * Handles the time update event for the video element.
 * Updates the current time and duration of the video.
 * Pauses the video if it reaches the end.
 * @returns {void}
 */
function handleTimeUpdate(): void {
    if (!videoRef.value) return;
    currentTime.value = videoRef.value.currentTime;
    duration.value = videoRef.value.duration;
    const END_THRESHOLD = 0.05; // End of video threshold

    if (
        duration.value > 0 &&
        Math.abs(currentTime.value - duration.value) < END_THRESHOLD
    ) {
        videoRef.value.pause();
        isPlaying.value = false;
        videoRef.value.currentTime = 0;
        currentTime.value = 0;
    }
}

/**
 * Handles the seek action when the user interacts with the range input.
 * @param {Event} e - The event triggered by the input change.
 * @returns {void}
 */
function handleSeek(e: Event): void {
    if (!videoRef.value) return;
    const input = e.target as HTMLInputElement;
    const val = parseFloat(input.value);
    videoRef.value.currentTime = val;
}

/**
 * Enters fullscreen mode for the video element.
 * @returns {void}
 */
function enterFullscreen(): void {
    videoRef.value?.requestFullscreen?.();
}

/**
 * Handles the action when an option is selected from the options menu.
 * @param {string} action - The action selected from the options menu.
 */
async function handleMenuAction(action: string) {
    if (!userStore.user.username && action !== "share") {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "You must be logged in to perform this action.",
            duration: 3,
        } as ToastItem);
        return;
    }
    switch (action) {
        case "edit":
            showEditModal.value = true;
            break;
        case "report":
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message: "Thank you for reporting this post. Our moderators will review it shortly.",
                duration: 3,
            } as ToastItem);
            break;
        case "share":
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/${props.burrow}/post/${props.id}`);
                $event("emit-toast", {
                    id: createTicket(4),
                    type: ToastTypes.success,
                    message: "Link copied to clipboard!",
                    duration: 3,
                } as ToastItem);
            } catch (error: any) {
                $event("emit-toast", {
                    id: createTicket(4),
                    type: ToastTypes.danger,
                    message: error.message || "Something went wrong. Please try again.",
                    duration: 3,
                } as ToastItem);
            }
            break;
        case "delete":
            showModal.value = true;
            if (deleteConfirm.value) {
                const { deletePost } = useFetchPostDelete(props);
                try {
                    deletePost();
                    emit('delete');
                    $event("emit-toast", {
                        id: createTicket(4),
                        type: ToastTypes.success,
                        message: "Post has been deleted succesfully!",
                        duration: 3,
                    } as ToastItem);
                    if (!props.singleView) {
                        isVisible.value = false;
                    }
                    showModal.value = false;
                } catch (e) {
                    showModal.value = false;
                }
            }
            break;
    }
}
</script>

<template><!-- Modal Overlay Background -->
<div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
<!-- Deletion Modal -->
<div v-if="showModal"
    class="fixed inset-0 size-fit rounded-xl m-auto z-50 text-font flex flex-col items-center justify-center bg-fill p-6 max-w-xl w-auto shadow-xl">
    <div>
        <!-- Close Button (top right) -->
        <button class="absolute top-2 right-2 text-xl text-font-light hover:text-font" @click="showModal = false"
            aria-label="Close">
            <i class="fi fi-sr-cross-small"></i>
        </button>
    </div>
    <div class="flex flex-col items-center mb-4 w-full">
        <p class="text-xl font-semibold mb-4">Delete your post?</p>

        <div class="w-full">
            <PostComponent :key="props.id + props.comments" v-bind="props" :is-preview="true" />
        </div>
    </div>

    <!-- Deletion Modal Buttons -->
    <div class="flex flex-col gap-4 w-full text-center">
        <div class="flex gap-2 w-full">
            <button class="px-4 flex-1 py-2 border border-fill-light text-font rounded-full hover:bg-fill-light"
                @click="showModal = false">
                Cancel
            </button>
            <button class="px-4 flex-1 py-2 bg-brand-negative text-font rounded-full hover:bg-red-700" @click="
                deleteConfirm = true;
            handleMenuAction('delete');
            ">
                Confirm
            </button>
        </div>
        <p class="text-font-light text-sm">
            Once deleted, there is no going back!
        </p>
    </div>
</div>

<!-- Post Component -->
<div v-if="isVisible"
    class="bg-main border border-fill hover:bg-main-hover hover:border-main-hover rounded-xl p-4 text-font flex flex-col gap-[10px]"
    :class="{
        'pointer-events-none select-none border-fill-light': loading || isPreview,
    }" @click="
        (e: Event) => {
            if (
                (e.target as HTMLElement).closest(
                    'button, a, input, textarea, svg, path, i',
                )
            )
                return;
            if (burrow) navigateTo(`/${burrow}/post/${id}`);
        }
    ">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div class="flex items-center" :class="burrowHidden ? 'gap-2' : 'gap-3'">
            <img v-if="!usernameHidden" :src="avatar
                ? getFilePath(avatar, FileTypes.hopperAvatar)
                : fallbackImage(FileTypes.hopperAvatar)
                " alt="Avatar" class="rounded-full object-cover" :class="burrowHidden ? 'size-8' : 'size-10'" @error="
                    (e: Event) => {
                        if (e.target)
                            (e.target as HTMLImageElement).src =
                                fallbackImage(FileTypes.hopperAvatar);
                    }
                " />
            <img v-else :src="burrowAvatar
                ? getFilePath(burrowAvatar, FileTypes.burrowAvatar)
                : fallbackImage(FileTypes.burrowAvatar)
                " alt="Burrow Avatar" class="rounded-full object-cover size-8"
                @error="(e: Event) => { if (e.target) (e.target as HTMLImageElement).src = fallbackImage(FileTypes.burrowAvatar); }" />
            <img v-else :src="burrowAvatar
                ? getFilePath(burrowAvatar, FileTypes.burrowAvatar)
                : fallbackImage(FileTypes.burrowAvatar)
                " alt="Burrow Avatar" class="rounded-full object-cover size-8"
                @error="(e: Event) => { if (e.target) (e.target as HTMLImageElement).src = fallbackImage(FileTypes.burrowAvatar); }" />
            <div :class="{ 'flex gap-1': burrowHidden }">
                <div class="flex row center gap-2">
                    <NuxtLink :to="`/h/${username}`" v-if="!usernameHidden">
                        <p class="text-sm text-font font-semibold" data-popover-target="popover-animation">
                            {{ username }}
                        </p>
                    </NuxtLink>
                    <BirthdayComponent :birthday="birthday" />
                </div>
                <div class="flex flex-row items-center gap-1">
                    <NuxtLink v-if="!burrowHidden" :to="`/${burrow}`">
                        <p class="text-font-light" :class="usernameHidden ? 'text-sm font-semibold' : 'text-xs '
                            ">
                            {{ burrow }}
                        </p>
                    </NuxtLink>
                    <p class="text-xs text-font-light">
                        <span v-if="timeAgo">&bull;</span>
                        {{ timeAgo }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Join Button & Options Menu -->
        <div v-if="userLoggedIn" class="flex gap-2" @click.stop>
            <div v-if="!joinHidden">
                <joinComponent v-if="userLoggedIn && !joinHidden" :burrow-id="props.burrowId"
                    :hopper-id="userStore.user.id" :member="member" @update:member="member = $event" />
            </div>

            <OptionsMenu :options="[
                ...(isOwnPost
                    ? [
                        {
                            label: 'Edit',
                            icon: 'fi fi-sr-pencil',
                            value: 'edit',
                        },
                    ]
                    : []),
                ...(!isOwnPost
                    ? [
                        {
                            label: 'Report',
                            icon: 'fi fi-sr-flag-alt',
                            value: 'report',
                        },
                    ]
                    : []),
                ...(isOwnPost
                    ? [
                        {
                            label: 'Delete',
                            icon: 'fi fi-sr-trash-xmark',
                            style: 'color: red',
                            value: 'delete',
                        },
                    ]
                    : []),
            ]" @select="handleMenuAction" />
        </div>
    </div>

    <div v-if="(label && burrowHidden) || (label && singleView) || isSpoiler || isNSFW" class="flex gap-2 -mb-1 h-7">
        <!-- Tag Label -->
        <div v-if="(label && burrowHidden) || (label && singleView)" class="mb-1">
            <span class="inline-flex h-7 rounded-full items-center px-2 pr-3 py-1 text-xs font-semibold text-white"
                :style="`background-color: #${label.color}`">
                <i class="fi fi-sr-label ml-1 mr-1"></i>
                {{ label.name }}
            </span>
        </div>
        <span v-if="isSpoiler"
            class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-font">
            <i class="fi fi-sr-eye-crossed mr-1"></i> Spoiler
        </span>
        <span v-if="isNSFW"
            class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-600 text-font">
            <i class="fi fi-ss-age-restriction-eighteen"></i> NSFW
        </span>
    </div>

    <div class="relative">
        <!-- Spoiler/NSFW Overlay -->
        <div v-if="(isSpoiler || isNSFW) && !showContent && !singleView"
            class="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
            <div class="mb-3 flex flex-col items-center gap-2">
                <span v-if="isSpoiler"
                    class="inline-flex items-center gap-1 px-2 py-0.5 h-7 rounded-full text-xs font-semibold bg-yellow-500 text-font">
                    <i class="fi fi-sr-eye-crossed mr-1"></i> Spoiler
                </span>
                <span v-if="isNSFW"
                    class="inline-flex items-center gap-1 px-2 py-0.5 h-7 rounded-full text-xs font-semibold bg-red-600 text-font">
                    <i class="fi fi-ss-age-restriction-eighteen"></i> NSFW
                </span>
            </div>
            <Button label="Show content" variant="primary" color="fill" size="medium" rounded
                @click="() => { showContent = true; togglePlay(); }" />
        </div>

        <!-- Content Blur -->
        <div :class="{
            'filter blur-md pointer-events-none select-none': ((isSpoiler || isNSFW) && !showContent && !singleView)
        }">
            <!-- Title & Description -->
            <div class="flex flex-col" :class="{ 'mb-2': media }">
                <p class="font-semibold" :class="{ 'text-xl': singleView }">
                    {{ title }}
                </p>
                <p class="text-font-light" v-if="description && !descriptionHidden && description.trim().length > 0"
                    :class="{
                        hidden:
                            (!singleView && type == PostTypes.video) ||
                            (!singleView && type == PostTypes.image),
                    }">
                    {{ description }}
                </p>
            </div>

            <!-- Media -->
            <div v-if="media" class="relative mb-0.5">
                <!-- Image -->
                <div>
                    <div v-if="(media || loading) && type === 'image'"
                        class="rounded-lg overflow-hidden w-full relative" :class="{
                            'bg-gray-500 animate-pulse pt-[56.25%]': loading || !media,
                            'cursor-pointer': singleView,
                        }" @click="singleView ? showImageModal = true : undefined">
                        <img :src="getFilePath(media, FileTypes.postImage)" :alt="imageAlt"
                            class="w-full object-cover max-h-[35vw]" :class="{
                                'filter blur-xl': (isSpoiler || isNSFW) && !showContent && !singleView
                            }" @error="
                                (e: Event) => {
                                    if (e.target)
                                        (e.target as HTMLImageElement).src = fallbackImage(FileTypes.postImage);
                                }
                            " />
                    </div>

                    <!-- Video -->
                    <div v-if="media && type === 'video'"
                        class="rounded-lg overflow-hidden w-full bg-black group relative aspect-video max-h-[56.25vw]"
                        :class="{ 'bg-gray-500 animate-pulse pt-[56.25%]': loading }">
                        <video ref="videoRef" class="w-full h-full object-cover" :class="{
                            'filter blur-xl': (isSpoiler || isNSFW) && !showContent && !singleView
                        }" :muted="muted" playsinline @timeupdate="handleTimeUpdate" @loadedmetadata="handleTimeUpdate"
                            @click="togglePlay">
                            <source :src="getFilePath(media, FileTypes.postVideo)" type="video/mp4" />
                            Sorry, your browser can't play this video.
                        </video>
                        <div
                            class="flex items-center justify-between px-3 py-2 bg-fill-light rounded-b-lg gap-2 absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="flex gap-2">
                                <IconButton variant="primary" color="fill" size="medium" rounded @click="togglePlay">
                                    <i :class="isPlaying ? 'fi fi-sr-pause' : 'fi fi-sr-play'" class="size-3.5"></i>
                                </IconButton>
                                <IconButton variant="primary" color="fill" size="medium" rounded @click="toggleMute">
                                    <i :class="muted ? 'fi fi-sr-volume-mute' : 'fi fi-sr-volume'" class="size-3.5"></i>
                                </IconButton>
                            </div>
                            <input type="range" min="0" :max="duration" step="0.1" :value="currentTime"
                                class="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer accent-brand"
                                @input="handleSeek" />
                            <IconButton variant="primary" color="fill" size="medium" rounded @click="enterFullscreen">
                                <i class="fi fi-sr-expand size-3.5 -ml-[-0.75px]"></i>
                            </IconButton>
                        </div>
                    </div>
                </div>

                <!-- Image Modal -->
                <div v-if="showImageModal"
                    class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overflow-hidden overscroll-none"
                    @click="showImageModal = false">
                    <div class="relative max-w-full max-h-full">
                        <button class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
                            @click="showImageModal = false">
                            <i class="fi fi-sr-cross-small"></i>
                        </button>
                        <img :src="getFilePath(media, FileTypes.postImage)" :alt="imageAlt"
                            class="max-w-full max-h-full object-contain" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-fontLight text-sm">
        <div class="flex gap-4">
            <!-- Upvotes -->
            <PraiseComponent :id="props.id" :praise="props.praise" :upvotes="upvotes" :type="'post'"
                @refresh="emit('refresh')" />

            <!-- Comments -->
            <div class="flex items-center gap-2 rounded-3xl pr-3 bg-fill-light">
                <IconButton variant="primary" color="fill" size="medium" rounded
                    @click="navigateTo(`/${burrow}/post/${id}`);">
                    <i class="fi fi-sr-comment-dots size-3.5"></i>
                </IconButton>
                <p class="text-xs font-semibold">
                    {{ formatNumber(comments) }}
                </p>
            </div>
        </div>

        <!-- Share -->
        <Button label="Share" icon-path="icons/redo.svg" variant="primary" classname="px-3" color="fill" rounded
            size="medium" @click="handleMenuAction('share')">
            <i class="fi fi-sr-redo"></i>
        </Button>
    </div>
    <EditPostComponent v-if="showEditModal" :open="showEditModal" :post="props" @close="showEditModal = false"
        @updated="showEditModal = false; emit('refresh')" />
</div>
</template>
