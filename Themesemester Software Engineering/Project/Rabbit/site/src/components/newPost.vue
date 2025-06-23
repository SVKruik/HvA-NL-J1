<script lang="ts" setup>
import {
    ref,
    computed,
    reactive,
    onMounted,
    onBeforeUnmount,
    type Ref,
} from "vue";
import { Button, Input, Textarea } from "~/components";
import { useFetchPostCreate } from "~/utils/fetch/post/useFetchPostCreate";
import { useFetchBurrowsAllowed } from "~/utils/fetch/burrow/useFetchBurrowsAllowed";
import type {
    Burrow,
    Label,
    PostData,
    TextareaType,
} from "../assets/customTypes";
import { FileTypes } from "../assets/customTypes";
import { useFetchBurrowLabels } from "~/utils/fetch/burrow/useFetchBurrowLabels";
import { getFilePath } from "~/utils/file";
import { getTextColor } from "~/utils/format";
import { createTicket } from "~/utils/ticket";
const userStore = useUserStore();
const { $event } = useNuxtApp();
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

const openBurrows = ref(false);
const searchTerm = ref("");
const showlabelOptions = ref(false);
const labelSearchTerm = ref("");
const availablelabels = ref<Label[]>([]);
const tabs: TextareaType[] = ["text", "image", "video"];

const isCreating = ref(false);
const mediaFileInput: Ref<File | null> = ref(null);
const userCaption = ref("");
const dropdownRef = ref<HTMLElement | null>(null);
const burrows: Ref<Burrow[]> = ref([]);

const postData = reactive({
    title: "",
    isNsfw: false,
    isSpoiler: false,
    canCommand: false,
    isConcept: false,
    description: "",
    activeTab: "text" as TextareaType,
    selectedBurrow: null as null | Burrow,
    selectedlabel: null as null | Label,
});

/**
 * @description Sets the media file based on the selected file input.
 * @param event - The event triggered by the file input change
 * @throws Will throw an error if the file type is not supported.
 */
function setMediaFile(event: Event): void {
    try {
        if (postData.activeTab !== "image" && postData.activeTab !== "video") {
            mediaFileInput.value = null;
            userCaption.value = "";
            return;
        }
        const fileInput = event.target as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
            mediaFileInput.value = null;
            userCaption.value = "";
            return;
        }

        const file = fileInput.files[0];
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");
        if (!isImage && !isVideo) {
            throw new Error(
                "Unsupported file type. Please upload an image or video.",
            );
        }

        mediaFileInput.value = file;
        userCaption.value = createTicket();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        toast(
            error.message || "File upload failed. Please try again.",
            "danger",
        );
    }
}

const filteredlabels = computed(() =>
    availablelabels.value.filter((label) =>
        label.name.toLowerCase().includes(labelSearchTerm.value.toLowerCase()),
    ),
);

/**
 * @description Toggles the visibility of the label search options.
 */
function togglelabelSearch() {
    showlabelOptions.value = !showlabelOptions.value;
}

/**
 * @description Adds a label to the selected labels if it is not already present.
 * Also closes the label dropdown immediately after selection.
 * @param label - The label to be added
 */
function addlabel(label: Label) {
    postData.selectedlabel = label;
    showlabelOptions.value = false; // Close dropdown after selecting
}

/**
 * @description Removes a label from the selected labels.
 */
function removelabel() {
    postData.selectedlabel = null;
}

// Fetch burrows on component mount
onMounted(async () => {
    try {
        const data = await useFetchBurrowsAllowed(userStore.user.id);
        burrows.value =
            data?.map((burrow) => ({
                ...burrow,
                is_nsfw_allowed: burrow.is_nsfw_allowed ?? false,
            })) ?? [];
    } catch (err) {
        const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (err as { message?: string })?.message ||
            "Failed to featch burrows. Please try again.";

        toast(errorMessage, "danger");
    }
    document.addEventListener("click", handleClickOutside);
});
// Cleanup event listener on component unmount
onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});

// Filter burrows based on search term
const filteredBurrows = computed(() => {
    if (!searchTerm.value.trim()) return burrows.value;
    return burrows.value.filter((b) =>
        b.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
    );
});

/**
 * @description Selects a burrow and fetches its labels.
 * @param burrow - The burrow object to be selected
 * @throws Will throw an error if fetching burrow labels fails.
 */
async function selectBurrow(burrow: Burrow) {
    postData.selectedBurrow = burrow;
    searchTerm.value = burrow.name;
    openBurrows.value = false;

    try {
        const labels = await useFetchBurrowLabels(burrow.id);
        availablelabels.value = labels.map((t) => t);
    } catch (err) {
        const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (err as { message?: string })?.message ||
            "Failed to fetch burrow labels. Please try again.";
        toast(errorMessage, "danger");
        availablelabels.value = [];
    }
}
/**
 * @description Handles the focus event on the input field.
 */
function handleInputFocus() {
    openBurrows.value = true;
}
// Create a unique ticket ID
const props = withDefaults(
    defineProps<{
        open: boolean;
    }>(),
    {},
);

const emit = defineEmits<{
    (e: "close"): void;
}>();

/**
 * @description Handles the click event outside the dropdown to close it.
 * @param event - The mouse event triggered on click
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
 * @description Creates a unique ticket ID.
 */
async function onSaveDraft() {
    postData.isConcept = true;
    handleSubmit();
}
/**
 * @description Handles the submission of the post creation form.
 * @throws Will throw an error if the submission fails.
 */
async function handleSubmit() {
    if (userStore.isLoggedIn === false) {
        toast("Please log in to create a post.", "warning");
        return;
    }
    if (!postData.selectedBurrow || !postData.title.trim()) {
        toast("Please select a burrow and enter a title.", "warning");
        return;
    }
    const payload: PostData = {
        hopper_id: userStore.user.id,
        burrow_id: postData.selectedBurrow.id,
        burrow_label_id: postData.selectedlabel?.id,
        title: postData.title,
        description: postData.description,
        type: postData.activeTab.toLowerCase().replace(/[^a-z]/g, ""),
        is_nsfw: postData.isNsfw,
        is_spoiler: postData.isSpoiler,
        is_concept: postData.isConcept,
        can_praise: false,
        can_comment: postData.canCommand,
        date_creation: new Date(),
    };

    const formData = new FormData();
    formData.append("createPostPayload", JSON.stringify(payload));

    if (postData.activeTab === "image" || postData.activeTab === "video") {
        if (mediaFileInput.value) {
            formData.append("mediaFile", mediaFileInput.value);
        }
        formData.append("fileNamePost", userCaption.value);
    }

    try {
        isCreating.value = true;
        await useFetchPostCreate(formData);

        toast(
            postData.isConcept
                ? "Draft saved successfully!"
                : "Post created successfully!",
            "success",
        );

        emit("close");
        Object.assign(postData, {
            title: "",
            isNsfw: false,
            isSpoiler: false,
            isConcept: false,
            canCommand: false,
            description: "",
            selectedBurrow: null,
            selectedlabel: null,
        });
        mediaFileInput.value = null;
        userCaption.value = "";
        searchTerm.value = "";
        openBurrows.value = false;
        showlabelOptions.value = false;
        labelSearchTerm.value = "";
        availablelabels.value = [];
    } catch (err) {
        const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (err as { message?: string })?.message ||
            "Failed to create post. Please try again.";

        toast(errorMessage, "danger");
    } finally {
        isCreating.value = false;
    }
}
</script>

<template>
<Teleport to="body">
    <div v-if="props.open"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 overflow-scroll">
        <div
            class="w-full max-w-3xl rounded-xl bg-fill p-6 text-font shadow-xl relative max-h-[calc(100vh-10rem)] overflow-auto">
            <button class="absolute top-4 right-4 text-2xl text-font hover:text-red-400" @click="emit('close')">
                &times;
            </button>

            <h2 class="text-xl font-semibold mb-4">Create post</h2>

            <div ref="dropdownRef" class="mb-4 relative">
                <div class="relative">
                    <input v-model="searchTerm"
                        class="w-full pl-12 pr-4 py-2 rounded-md border border-gray-700 bg-fill-light text-font"
                        placeholder="Select or search burrow" @focus="handleInputFocus" />
                    <div v-if="postData.selectedBurrow" class="absolute left-3 top-2 flex items-center">
                        <img :src="getFilePath(
                            postData.selectedBurrow.avatar,
                            FileTypes.burrowAvatar,
                        )
                            " alt="Burrow Avatar" class="w-6 h-6 rounded-full object-cover" @error="
                                (e) => {
                                    if (e.target) {
                                        (e.target as HTMLImageElement).src =
                                            fallbackImage(
                                                FileTypes.burrowAvatar,
                                            );
                                    }
                                }
                            " />
                    </div>
                </div>

                <div v-if="openBurrows"
                    class="absolute z-50 mt-2 w-full bg-fill-light border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div v-for="burrow in filteredBurrows" :key="burrow.id"
                        class="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 gap-3"
                        @click="selectBurrow(burrow)">
                        <img :src="getFilePath(
                            burrow.avatar,
                            FileTypes.burrowAvatar,
                        )
                            " alt="Burrow Avatar" class="w-6 h-6 rounded-full object-cover" @error="
                                (e) => {
                                    if (e.target) {
                                        (e.target as HTMLImageElement).src =
                                            fallbackImage(
                                                FileTypes.burrowAvatar,
                                            );
                                    }
                                }
                            " />
                        <span>{{ burrow.name }}</span>
                    </div>
                    <div v-if="filteredBurrows.length === 0" class="px-4 py-2 text-gray-400">
                        No results
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <div class="flex space-x-4 border-b border-gray-700 pb-2">
                    <span v-for="tab in tabs" :key="tab"
                        class="pb-1 cursor-pointer transition-all duration-300 capitalize" :class="[
                            postData.activeTab === tab
                                ? 'text-font border-b-2 border-brand'
                                : 'text-gray-500 border-b-2 border-transparent',
                        ]" @click="postData.activeTab = tab">
                        {{ tab }}
                    </span>
                </div>
            </div>

            <Input id="Title" v-model="postData.title" color="Ebony Clay" fill :icon="false" label="Title"
                :max-length="0" required size="medium" small-text class="mb-1.5 border-gray-700" />
            <div class="flex row mt-4">
                <div class="flex items-center mb-4">
                    <label class="inline-flex items-center me-5 cursor-pointer">
                        <input v-model="postData.isSpoiler" type="checkbox" value="" class="sr-only peer" checked />
                        <div
                            class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                        </div>
                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Spoiler</span>
                    </label>
                </div>
                <div v-if="
                    postData.selectedBurrow
                        ? postData.selectedBurrow.is_nsfw_allowed
                        : false
                " class="flex items-center mb-4">
                    <label class="inline-flex items-center me-5 cursor-pointer">
                        <input v-model="postData.isNsfw" type="checkbox" value="" class="sr-only peer" checked />
                        <div
                            class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                        </div>
                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">18+</span>
                    </label>
                </div>
            </div>

            <div class="relative w-full">
                <div class="flex row mb-4">
                    <Button v-if="availablelabels.length > 0" color="fill" :fill="false" iconposition="right" :label="showlabelOptions ? 'Close labels' : 'Add labels'
                        " size="large" variant="primary" @click="togglelabelSearch" />
                    <div v-if="postData.selectedlabel" class="flex flex-wrap gap-2 ml-4">
                        <span class="inline-flex items-center px-2 text-sm font-small rounded-md" :style="{
                            backgroundColor: `#${postData.selectedlabel.color}`,
                        }" :class="getTextColor(postData.selectedlabel.color)
                            ">
                            {{ postData.selectedlabel.name }}
                            <button type="button" class="inline-flex items-center ml-2 text-sm bg-transparent rounded"
                                :aria-label="`Remove ${postData.selectedlabel}`" :class="getTextColor(
                                    postData.selectedlabel.color,
                                )
                                    " @click="removelabel()">
                                &times;
                            </button>
                        </span>
                    </div>
                </div>
                <div v-if="showlabelOptions"
                    class="absolute z-50 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <Input v-model="labelSearchTerm" color="Ebony Clay" fill :icon="true" label="Search labels"
                        :max-length="0" size="medium" small-text class="mb-1.5 border-gray-700" />

                    <div v-for="label in filteredlabels" :key="label.name"
                        class="px-4 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
                        @click="addlabel(label)">
                        {{ label.name }}
                    </div>

                    <div v-if="filteredlabels.length === 0" class="px-4 py-2 text-gray-400">
                        No labels found
                    </div>
                </div>
            </div>
            <Textarea v-if="
                postData.activeTab === 'image' ||
                postData.activeTab === 'video'
            " color="Ebony Clay" fill label="Upload media" :max-length="0" :required="false" size="large" small-text
                :type="postData.activeTab" @change="setMediaFile" />
            <div v-if="
                postData.activeTab === 'image' ||
                postData.activeTab === 'video'
            " class="mt-4 mb-4"></div>
            <Textarea v-model="postData.description" data-testid="description-post" color="Ebony Clay" fill
                label="Enter text..." :max-length="0" :required="false" size="large" small-text type="text" />

            <div class="flex justify-end gap-2 mt-4">
                <Button color="orange" :disabled="false" :fill="false" iconposition="right" label="Save draft"
                    size="large" variant="outline" @click="onSaveDraft" />
                <Button data-testid="post-post" color="orange" :fill="false" iconposition="right" label="Post"
                    size="large" variant="primary" @click="handleSubmit" />
            </div>
        </div>
    </div>
</Teleport>
</template>
