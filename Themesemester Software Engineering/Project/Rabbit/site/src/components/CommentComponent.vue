<script setup lang="ts">
import { FileTypes, ToastTypes, type CommentComponentProps, type ToastItem } from "~/assets/customTypes";
import PraiseComponent from "./PraiseComponent.vue";
import OptionsMenu from "./OptionsMenu.vue";
import { useFetchCommentCreate } from "~/utils/fetch/comments/useFetchCommentCreate";
import { useFetchCommentDelete } from "~/utils/fetch/comments/useFetchCommentDelete";
import { useFetchCommentUpdate } from "~/utils/fetch/comments/useFetchCommentUpdate";

// Composables and stores
const { $event } = useNuxtApp();
const userStore = useUserStore();
const props = defineProps<CommentComponentProps>();
const emit = defineEmits(["refresh"]);

// Reactive data
const isOwnPost = computed(() => userStore.user?.username === props.comment.username);
const showReplyInput = ref(false);
const replyText = ref("");
const showReplies = ref(false);
const showDeleteModal: Ref<boolean> = ref(false);
const showEditModal = ref(false);
const editedText = ref("");
const isEdited = computed(() => !!props.comment.dateModified);

// Child replies to this comment
const childReplies = computed(() =>
    (props.replies ?? []).filter(r => r.commentId === props.comment.id)
);

// Reply count for this comment
const replyCount = computed(() => childReplies.value.length);

// Parent comment of a reply. If it has been deleted, this will be null.
const parentComment = computed(() =>
    props.allComments.find(c => c.id === props.comment.commentId)
);

// Checks if this comment is a reply to a comment that no longer exists.
// This is used to display a message indicating that the original comment has been deleted.
const parentless = computed(() =>
    props.comment.commentId !== 0 &&
    !props.allComments.find(c => c.id === props.comment.commentId)
);

const { createComment } = useFetchCommentCreate();
const { updateComment } = useFetchCommentUpdate();
const { deleteComment } = useFetchCommentDelete();

/**
 * Submits a reply to the comment.
 * Validates the reply text and creates a new comment if valid.
 * Resets the reply text and hides the reply input after submission.
 * Emits a refresh event to update the comment list.
 */
async function submitReply() {
    if (!replyText.value.trim()) return;
    if (!props.postId) return;

    await createComment({
        content: replyText.value.trim(),
        postId: props.postId,
        parentCommentId: props.comment.id,
    });

    replyText.value = "";
    showReplyInput.value = false;
    showReplies.value = true;
    emit("refresh");
}

/**
 * Handles the action when an option is selected from the options menu.
 * @param {string} action - The action selected from the options menu.
 */
async function handleMenuAction(action: string) {
    if (!userStore.user.username) {
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
            editedText.value = props.comment.content;
            showEditModal.value = true;
            break;
        case "report":
            $event("emit-toast", {
                id: createTicket(4),
                type: ToastTypes.danger,
                message: "Thank you for reporting this comment. Our moderators will review it shortly.",
                duration: 3,
            } as ToastItem);
            break;
        case "delete":
            showDeleteModal.value = true;
            break;
    }
}

/**
 * Submits the deletion of the comment.
 * Sets the delete confirmation state to true and attempts to delete the comment.
 * If successful, it emits a refresh event and closes the delete modal.
 * If an error occurs, it logs the error and closes the modal.
 */
async function submitDelete() {
    try {
        await deleteComment(props.comment.id);
        emit("refresh");
        showDeleteModal.value = false;
    } catch (e) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: "Failed to delete comment. Please try again.",
            duration: 3,
        } as ToastItem);
        showDeleteModal.value = false;
    }
}

/**
 * Submits the edited comment content.
 * Validates the input and updates the comment if valid.
 */
async function submitEdit() {
    if (!userStore.user?.username) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.warning,
            message: "You must be logged in to comment.",
            duration: 3,
        } as ToastItem);
        return;
    }

    const content = editedText.value.trim();
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

    try {
        await updateComment({ commentId: props.comment.id, content: content });
        showEditModal.value = false;
        emit("refresh");
    } catch (e) {
        $event("emit-toast", {
            id: createTicket(4),
            type: ToastTypes.danger,
            message: "Failed to update comment. Please try again.",
            duration: 3,
        } as ToastItem);
        showEditModal.value = false;
    }
}
</script>

<template><!-- Modal Overlay Background -->
<div v-if="showDeleteModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
<!-- Deletion Modal -->
<div v-if="showDeleteModal"
    class="fixed inset-0 size-fit rounded-xl m-auto z-50 text-font flex flex-col items-center justify-center bg-fill p-6 max-w-xl w-auto shadow-xl">
    <div>
        <!-- Close Button (top right) -->
        <button class="absolute top-2 right-2 text-xl text-font-light hover:text-font" @click="showDeleteModal = false"
            aria-label="Close">
            <i class="fi fi-sr-cross-small"></i>
        </button>
    </div>
    <div class="flex flex-col items-center mb-4 w-full">
        <p class="text-xl font-semibold mb-4">Delete your comment?</p>

        <div class="w-full">
            <CommentComponent :show-burrow="true" :comment="comment" :post-id="postId" :hopper-id="hopperId"
                :replies="replies" :is-reply="true" :is-preview="true" :all-comments="allComments"
                @refresh="emit('refresh')" />
        </div>
    </div>

    <!-- Deletion Modal Buttons -->
    <div class="flex flex-col gap-4 w-full text-center">
        <div class="flex gap-2 w-full">
            <button class="px-4 flex-1 py-2 border border-fill-light text-font rounded-full hover:bg-fill-light"
                @click="showDeleteModal = false">
                Cancel
            </button>
            <button class="px-4 flex-1 py-2 bg-brand-negative text-font rounded-full hover:bg-red-700" @click="
                submitDelete();
            ">
                Confirm
            </button>
        </div>
        <p class="text-font-light text-sm">Once deleted, there is no going back!</p>
    </div>
</div>

<!-- Edit Modal -->
<div v-if="showEditModal"
    class="fixed inset-0 size-fit rounded-xl m-auto z-50 text-font flex flex-col items-center justify-center bg-fill p-6 max-w-xl w-auto shadow-xl">
    <div>
        <!-- Close Button (top right) -->
        <button class="absolute top-2 right-2 text-xl text-font-light hover:text-font" @click="showEditModal = false"
            aria-label="Close">
            <i class="fi fi-sr-cross-small"></i>
        </button>
    </div>
    <div class="flex flex-col items-center mb-4 w-full">
        <p class="text-xl font-semibold mb-4">Edit your comment</p>
        <textarea v-model="editedText"
            class="w-full bg-fill-light rounded-lg p-3 text-sm text-font border border-fill focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="4" placeholder="Update your comment..." @keydown.enter.prevent
            @keydown.enter="submitEdit()"></textarea>
    </div>

    <!-- Edit Modal Buttons -->
    <div class="flex flex-col gap-4 w-full text-center">
        <div class="flex gap-2 w-full">
            <button class="px-4 flex-1 py-2 border border-fill-light text-font rounded-full hover:bg-fill-light"
                @click="showEditModal = false">
                Cancel
            </button>
            <button class="px-4 flex-1 py-2 bg-brand text-font rounded-full hover:bg-brand-hover" @click="submitEdit()"
                :disabled="!editedText.trim()" :class="{
                    'opacity-50 cursor-not-allowed': !editedText.trim(),
                }">
                Save
            </button>
        </div>
    </div>
</div>

<!-- Comment Body -->
<div class="block border bg-main border-fill rounded-lg py-3 px-4 mb-2 group" :class="{
    'pointer-events-none select-none border-fill-light': isPreview,
    'hover:bg-main-hover': !isReply,
}">
    <!-- Parent Info -->
    <span class="italic text-sm text-font-light" v-if="!comment.postId">
        (Original post been deleted)
    </span>
    <div v-if="comment.isReply" class="mb-2 text-sm text-font-light">
        <span class="italic" v-if="parentComment">
            Replying to <NuxtLink :to="`/h/${parentComment.username}`" class="font-medium">@{{
                parentComment.username }}
            </NuxtLink>
        </span>
        <span class="italic text-font-light" v-if="parentless">
            (Original comment has been deleted)
        </span>
    </div>

    <div class="flex items-start" :class="{ 'mt-2': !comment.isReply }">
        <img :src="getFilePath(comment.avatar, FileTypes.hopperAvatar)"
            class="size-10 rounded-full mr-4 bg-fill outline outline-2 outline-fill flex-shrink-0 cursor-pointer"
            @error="(e: Event) => { if (e.target) (e.target as HTMLImageElement).src = fallbackImage(FileTypes.hopperAvatar); }"
            @click="$router.push(`/h/${comment.username}`)" alt="Hopper Avatar" />
        <div class="flex-1">
            <div class="flex items-center text-sm text-font-light mb-1">
                <span class="text-font-light font-semibold">
                    <template v-if="!showBurrow">
                        <NuxtLink :to="`/h/${comment.username}`">{{ comment.username }}</NuxtLink>
                    </template>
                    <template v-else>{{ comment.username }}</template>
                </span>
                <span class="mx-1">•</span>
                <span>{{ comment.timeAgo }}</span>
                <span v-if="isEdited" class="ml-1 italic text-font-light">(Edited {{ comment.dateModified }})</span>
                <span v-if="comment.isReply" class="ml-1 text-fill-light">(Reply)</span>
            </div>

            <div class="text-font mt-1 mb-2">
                <span :class="{ 'cursor-pointer': comment.postId }"
                    @click="comment.postId && $route.path !== `/${comment.postBurrow}/post/${comment.postId}` && $router.push(`/${comment.postBurrow}/post/${comment.postId}`)">
                    {{ comment.content }}
                </span>
            </div>


            <div class="flex gap-2 w-fit">
                <PraiseComponent :id="comment.id" :upvotes="comment.upvotes" :praise="comment.praise" :type="'comment'"
                    @refresh="emit('refresh')" />
                <IconButton v-if="userStore.user?.username" :class="[
                    'flex justify-center items-center rounded-full font-semibold !text-font bg-fill hover:bg-fill-hover py-2 px-4 w-full'
                ]" variant="ghost" rounded size="medium" @click="showReplyInput = !showReplyInput"
                    title="Reply to this comment">
                    <i class="fi fi-sr-comments"></i> Reply
                </IconButton>
                <div @click.stop>
                    <OptionsMenu :options="[
                        ...(isOwnPost ? [{ label: 'Edit', icon: 'fi fi-sr-pencil', value: 'edit' }] : []),
                        ...(isOwnPost ? [] : [{ label: 'Report', icon: 'fi fi-sr-flag-alt', value: 'report' }]),
                        ...(isOwnPost
                            ? [
                                { label: 'Delete', icon: 'fi fi-sr-trash-xmark', style: 'color: red', value: 'delete' },
                            ]
                            : []),
                    ]" @select="handleMenuAction" />
                </div>
            </div>

            <!-- Reply input -->
            <div v-if="showReplyInput && userStore.user?.username" class="mt-3 w-full">
                <div class="relative flex items-center mb-2">
                    <i
                        class="fi fi-sr-comment -mt-1 absolute left-4 w-4 h-4 text-font-light pointer-events-none z-20"></i>
                    <input v-model="replyText" type="text" placeholder="Write a reply..."
                        class="rounded-full p-2 px-5 pl-11 text-sm text-font bg-fill border-none placeholder:text-font-light w-full pr-14"
                        @keyup.enter="submitReply" />
                    <button v-if="replyText" @click="replyText = ''"
                        class="absolute right-14 z-20 flex items-center justify-center w-5 h-5 rounded-full hover:bg-fill-hover"
                        type="button" aria-label="Clear reply">
                        <svg class="w-4 h-4 text-font-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button @click="submitReply"
                        class="absolute right-2 -mb-1 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-font-light hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="!replyText" type="button" aria-label="Post reply">
                        <i class="fi fi-br-arrow-turn-down-right"></i>
                    </button>
                </div>
            </div>

            <!-- Collapse toggle -->
            <button v-if="replyCount > 0" class="mt-2 text-sm text-font-light hover:underline"
                @click="showReplies = !showReplies">
                {{ showReplies ? 'Hide' : '+' + replyCount + ' repl' + (replyCount === 1 ? 'y' : 'ies') }}
            </button>
        </div>
    </div>

    <!-- Nested replies -->
    <div v-if="showReplies && replyCount > 0" class="ml-6 pl-6 border-l-2 border-fill-light mt-2">
        <CommentComponent v-for="child in childReplies" :key="child.id" :comment="child" :post-id="postId"
            :hopper-id="hopperId" :replies="replies" :all-comments="allComments" :is-reply="true"
            @refresh="emit('refresh')" />
    </div>
</div>
</template>