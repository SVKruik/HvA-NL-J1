<script lang="ts" setup>
import {
    ButtonComponent as Button,
    InputComponent as Input,
    TextareaComponent as Textarea,
} from "#components";
import { FileTypes } from "../assets/customTypes";
import { useFetchBurrowLabels } from "~/utils/fetch/burrow/useFetchBurrowLabels";
import { useFetchEditPost } from "~/utils/fetch/post/useFetchEditPost";
import { useFetchBurrowById } from "~/utils/fetch/burrow/useFetchBurrowById";
import type {
    Burrow,
    Label,
    PostComponentProps,
    PostDataEdit,
    TextareaType,
} from "../assets/customTypes";

// Props and emits
const props = withDefaults(
    defineProps<{
        open: boolean;
        post: PostComponentProps;
    }>(),
    {},
);
const emit = defineEmits<{
    (e: "close" | "updated"): void;
}>();

// App & store
const { $event } = useNuxtApp();
const userStore = useUserStore();

// Refs and state
const tabs: TextareaType[] = ["text", "image", "video"];
const openBurrows = ref(false);
const showlabelOptions = ref(false);
const labelSearchTerm = ref("");
const availablelabels = ref<Label[]>([]);
const mediaFileInput: Ref<File | null> = ref(null);

const dropdownRef = ref<HTMLElement | null>(null);
const isSaving = ref(false);
const burrow = ref<Burrow>();
const TOAST_MESSAGES = {
    labelRequired: "Please select a label",
    unsupportedFile: "Unsupported file type. Please upload an image or video.",
    updateSuccess: "Post updated successfully!",
    updateFailed: "Failed to update post. Please try again.",
};

const postData = reactive({
    postID: props.post.id,
    title: props.post.title || "",
    isNsfw: props.post.isNSFW || false,
    isSpoiler: props.post.isSpoiler || false,
    description: props.post.description || "",
    activeTab: props.post.type || "text",
    selectedlabel: props.post.label ?? null,
    media: props.post.media || undefined,
    burrowId: props.post.burrowId,
});

// Computed
const filteredlabels = computed(() =>
    availablelabels.value.filter((label) =>
        label.name.toLowerCase().includes(labelSearchTerm.value.toLowerCase()),
    ),
);

// Lifecycle hooks
onMounted(async () => {
    burrow.value = await useFetchBurrowById(postData.burrowId);
    if (postData.postID) {
        availablelabels.value = await useFetchBurrowLabels(postData.burrowId);
    }
    document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

// Watchers
watch(
    () => postData.burrowId,
    async (burrow) => {
        if (burrow) {
            const labels = await useFetchBurrowLabels(postData.burrowId);
            availablelabels.value = labels;
        }
    },
);

/**
 * Toggles the visibility of the label search dropdown.
 */
function togglelabelSearch() {
    showlabelOptions.value = !showlabelOptions.value;
}

/**
 * Assigns the selected label to the post data and closes the dropdown.
 * @param label - The label object selected by the user
 */
function addlabel(label: Label) {
    postData.selectedlabel = label;
    showlabelOptions.value = false; // Close dropdown when label is selected
}

/**
 * Removes the currently selected label from the post data.
 */
function removelabel() {
    postData.selectedlabel = null;
}

/**
 * Handles closing the dropdown when clicking outside of it.
 * @param event - The mouse click event
 */
function handleClickOutside(event: MouseEvent) {
    if (
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target as Node)
    ) {
        openBurrows.value = false;
    }
}

/**
 * Displays a toast message.
 * @param message - The message to be displayed
 * @param type - Type of toast: success, info, warning, or danger
 * @param duration - Duration in seconds the toast should be visible
 */
function toast(
    message: string,
    type: "success" | "info" | "warning" | "danger" = "info",
    duration = 5,
) {
    $event("emit-toast", {
        id: createTicket(),
        message,
        type,
        duration,
    });
}

/**
 * Sets the media file based on the selected file input.
 * @param event - The event triggered by the file input change
 * @throws Will throw an error if the file type is not supported.
 */
function setMediaFile(event: Event): void {
    try {
        if (postData.activeTab !== "image" && postData.activeTab !== "video") {
            mediaFileInput.value = null;
            return;
        }
        const fileInput = event.target as HTMLInputElement;
        if (!fileInput.files?.length) {
            mediaFileInput.value = null;
            return;
        }
        const file = fileInput.files[0];
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
            throw new Error(TOAST_MESSAGES.unsupportedFile);
        }
        mediaFileInput.value = file;
    } catch (error) {
        toast(
            error instanceof Error
                ? error.message
                : "File upload failed. Please try again.",
            "danger",
        );
    }
}

/**
 * Handles updating the post, including validation, file processing,
 * and sending the update request.
 */
async function handleUpdate() {
    // Label is now optional, so we remove the required check
    // if (!postData.selectedlabel) {
    //     toast(TOAST_MESSAGES.labelRequired, "warning");
    //     return;
    // }

    let mediaFilename = props.post.media;
    if (mediaFileInput.value) {
        if (!mediaFilename) {
            mediaFilename = createTicket();
        }
        Object.defineProperty(mediaFileInput.value, "name", {
            writable: true,
            value: mediaFilename,
        });
    }

    const payload: PostDataEdit = {
        post_id: props.post.id,
        hopper_id: userStore.user.id,
        burrow_id: props.post.burrowId,
        burrow_label_id: postData.selectedlabel?.id,
        title: postData.title,
        description: postData.description,
        type: postData.activeTab.toLowerCase().replace(/[^a-z]/g, ""),
        is_nsfw: postData.isNsfw,
        is_spoiler: postData.isSpoiler,
        can_praise: false,
        can_comment: true,
        media: mediaFilename ?? undefined,
        is_concept: false,
        date_creation: new Date(),
    };

    const formData = new FormData();
    formData.append("editPostPayload", JSON.stringify(payload));
    if (mediaFileInput.value) {
        formData.append(
            "mediaFile",
            mediaFileInput.value,
            mediaFilename ?? undefined,
        );
    }

    try {
        isSaving.value = true;
        await useFetchEditPost(formData);
        toast(TOAST_MESSAGES.updateSuccess, "success");
        emit("updated");
        emit("close");
    } catch (err) {
        toast(TOAST_MESSAGES.updateFailed, "warning");
        toast(
            (err as { message?: string })?.message ||
                "Failed to create burrow. Please try again.",
            "danger",
        );
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="props.open"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-scroll"
            @click.self="emit('close')"
        >
            <div
                class="w-full max-w-3xl rounded-xl bg-fill p-6 text-font shadow-xl relative max-h-[calc(100vh-10rem)] overflow-auto"
                @click.stop
            >
                <button
                    class="absolute top-4 right-4 text-2xl text-font hover:text-red-400"
                    @click="emit('close')"
                >
                    &times;
                </button>

                <h2 class="text-xl font-semibold mb-4">Edit post</h2>

                <div class="mb-4">
                    <div class="flex space-x-4 border-b border-gray-700 pb-2">
                        <span
                            v-for="tab in tabs"
                            :key="tab"
                            class="pb-1 cursor-pointer transition-all duration-300 capitalize"
                            :class="[
                                postData.activeTab === tab
                                    ? 'text-font border-b-2 border-brand'
                                    : 'text-gray-500 border-b-2 border-transparent',
                            ]"
                            @click="postData.activeTab = tab"
                        >
                            {{ tab }}
                        </span>
                    </div>
                </div>

                <Input
                    v-model="postData.title"
                    color="Ebony Clay"
                    fill
                    :icon="false"
                    label="Title"
                    :max-length="0"
                    required
                    size="medium"
                    small-text
                    class="mb-1.5 border-gray-700"
                />
                <div class="flex row mt-4">
                    <div class="flex items-center mb-4">
                        <label
                            class="inline-flex items-center me-5 cursor-pointer"
                        >
                            <input
                                v-model="postData.isSpoiler"
                                type="checkbox"
                                value=""
                                class="sr-only peer"
                            />
                            <div
                                class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover"
                            ></div>
                            <span
                                class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >Spoiler</span
                            >
                        </label>
                    </div>
                    <div
                        v-if="
                            postData.burrowId ? burrow?.is_nsfw_allowed : false
                        "
                        class="flex items-center mb-4"
                    >
                        <label
                            class="inline-flex items-center me-5 cursor-pointer"
                        >
                            <input
                                v-model="postData.isNsfw"
                                type="checkbox"
                                value=""
                                class="sr-only peer"
                            />
                            <div
                                class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover"
                            ></div>
                            <span
                                class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                                >18+</span
                            >
                        </label>
                    </div>
                </div>

                <div class="relative w-full">
                    <div class="flex row mb-4">
                        <Button
                            v-if="availablelabels.length > 0"
                            color="fill"
                            :fill="false"
                            iconposition="right"
                            :label="
                                showlabelOptions ? 'Close labels' : 'Add labels'
                            "
                            size="large"
                            variant="primary"
                            @click="togglelabelSearch"
                        />
                        <div
                            v-if="postData.selectedlabel"
                            class="flex flex-wrap gap-2 ml-4"
                        >
                            <span
                                class="inline-flex items-center px-2 text-sm font-small rounded-md"
                                :style="{
                                    backgroundColor: `#${postData.selectedlabel.color}`,
                                }"
                                :class="
                                    getTextColor(postData.selectedlabel.color)
                                "
                            >
                                {{ postData.selectedlabel.name }}
                                <button
                                    type="button"
                                    class="inline-flex items-center ml-2 text-sm bg-transparent rounded"
                                    :aria-label="`Remove ${postData.selectedlabel}`"
                                    :class="
                                        getTextColor(
                                            postData.selectedlabel.color,
                                        )
                                    "
                                    @click="removelabel()"
                                >
                                    &times;
                                </button>
                            </span>
                        </div>
                    </div>
                    <div
                        v-if="showlabelOptions"
                        class="absolute z-50 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
                    >
                        <Input
                            v-model="labelSearchTerm"
                            color="Ebony Clay"
                            fill
                            :icon="true"
                            label="Search labels"
                            :max-length="0"
                            size="medium"
                            small-text
                            class="mb-1.5 border-gray-700"
                        />

                        <div
                            v-for="label in filteredlabels"
                            :key="label.name"
                            class="px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                            @click="addlabel(label)"
                        >
                            {{ label.name }}
                        </div>

                        <div
                            v-if="filteredlabels.length === 0"
                            class="px-4 py-2 text-gray-400"
                        >
                            No labels found
                        </div>
                    </div>
                </div>
                <Textarea
                    v-if="
                        postData.activeTab === 'image' ||
                        postData.activeTab === 'video'
                    "
                    :model-value="postData.media"
                    :file-type="
                        postData.activeTab === 'video'
                            ? FileTypes.postVideo
                            : FileTypes.postImage
                    "
                    color="Ebony Clay"
                    fill
                    label="Upload media"
                    :max-length="0"
                    :required="false"
                    size="large"
                    small-text
                    :type="postData.activeTab"
                    @change="setMediaFile"
                />
                <div
                    v-if="
                        postData.activeTab === 'image' ||
                        postData.activeTab === 'video'
                    "
                    class="mt-4 mb-4"
                ></div>
                <Textarea
                    v-model="postData.description"
                    color="Ebony Clay"
                    fill
                    label="Enter text..."
                    :max-length="0"
                    :required="false"
                    size="large"
                    small-text
                    type="text"
                />

                <div class="flex justify-end gap-2 mt-4">
                    <Button
                        color="orange"
                        :disabled="isSaving"
                        :fill="false"
                        iconposition="right"
                        label="Cancel"
                        size="large"
                        variant="outline"
                        @click="emit('close')"
                    />
                    <Button
                        color="orange"
                        :fill="false"
                        iconposition="right"
                        label="Save"
                        size="large"
                        variant="primary"
                        :disabled="isSaving"
                        @click="handleUpdate"
                    />
                </div>
            </div>
        </div>
    </Teleport>
</template>
