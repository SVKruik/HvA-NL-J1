<script lang="ts" setup>
import {
    ButtonComponent as Button,
    InputComponent as Input,
    TextareaComponent as Textarea,
} from "#components";
import { useFetchTag } from "~/utils/fetch/tag/useFetchTag";
import { useFetchBurrowCreate } from "~/utils/fetch/burrow/useFetchBurrowCreate";
import type { newLabel, newBurrow, Tag } from "../assets/customTypes";

const userStore = useUserStore();
const stepOne = 1;
const stepTwo = 2;
const stepThree = 3;
const stepFour = 4;
const stepFive = 5;
const step: Ref<number> = ref(1);
const searchBurrow = ref("");
const labelInput = ref("");
const { $event } = useNuxtApp();
const burrowData = ref<newBurrow>({
    hopper_id: userStore.user.id,
    name: "",
    description: "",
    tags: [],
    avatar: "",
    banner: "",
    isNsfwAllowed: false,
    labels: [],
});
const avatarFile = ref<File | null>(null);
const bannerFile = ref<File | null>(null);
const tags = ref<Tag[]>([]);
const colorRef = ref<string>("#FFFFFF");
const isDirty = computed(() => {
    return (
        burrowData.value.name !== "" ||
        burrowData.value.description !== "" ||
        burrowData.value.tags.length > 0 ||
        burrowData.value.avatar !== "" ||
        burrowData.value.banner !== "" ||
        burrowData.value.labels.length > 0 ||
        avatarFile.value !== null ||
        bannerFile.value !== null
    );
});

/**
 * toggles the tag so it gets filled
 * @param tag - tag object
 */
function toggleTag(tag: Tag) {
    const index = burrowData.value.tags.findIndex((t) => t.id === tag.id);
    if (index === -1) {
        burrowData.value.tags.push(tag);
    } else {
        burrowData.value.tags.splice(index, 1);
    }
}
/**
 * removes tag
 * @param tag - tag object
 */
function removeTag(tag: Tag) {
    burrowData.value.tags = burrowData.value.tags.filter(
        (t) => t.id !== tag.id,
    );
}
/**
 * removes label
 * @param tag - label object
 */
function removeLabel(label: newLabel) {
    burrowData.value.labels = burrowData.value.labels.filter(
        (t) => t.name !== label.name,
    );
}

/**
 * @description Sets the media file based on the selected file input.
 * @param event - The event triggered by the file input change
 * @throws Will throw an error if the file type is not supported.
 */
function setMediaFile(event: Event, type: string): void {
    try {
        const fileInput = event.target as HTMLInputElement;
        if (!fileInput.files || fileInput.files.length === 0) {
            if (type === "avatar") {
                avatarFile.value = null;
                burrowData.value.avatar = "";
            } else if (type === "banner") {
                bannerFile.value = null;
                burrowData.value.banner = "";
            }
            return;
        }

        const file = fileInput.files[0];
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            throw new Error("Unsupported file type. Please upload an image");
        }
        if (type === "avatar") {
            avatarFile.value = file;
            burrowData.value.avatar = createTicket();
        } else if (type === "banner") {
            bannerFile.value = file;
            burrowData.value.banner = createTicket();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        toast(
            error.message || "File upload failed. Please try again.",
            "danger",
        );
    }
}
/**
 * check if site can reload without problem
 * @param event - current window
 */
function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (isDirty.value) {
        event.preventDefault();
        event.returnValue = "";
    }
}
onMounted(async () => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    try {
        const data = await useFetchTag();
        tags.value = data;
    } catch (err) {
        toast("Failed to fetch tags. Please try again.", "danger");
        const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (err as { message?: string })?.message ||
            "Failed to fetch burrows. Please try again.";

        toast(errorMessage, "danger");
    }
});
onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
});
// filters the tags based on typed input of user
const filteredTags = computed(() => {
    if (!searchBurrow.value) return tags.value;
    const query = searchBurrow.value.toLowerCase();
    return tags.value.filter((tag) => tag.name.toLowerCase().includes(query));
});

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
 * Create an image preview URL for the profile picture or banner.
 *
 * @param type The type of image to create (profilePicture or banner).
 */
function createImg(type: "avatar" | "banner"): string {
    if (type === "avatar") {
        return avatarFile.value
            ? URL.createObjectURL(avatarFile.value)
            : "/icons/avatar.svg";
    } else
        return bannerFile.value
            ? URL.createObjectURL(bannerFile.value)
            : "/img/banner.png";
}
/**
 * Goes to previous page of check
 */
function prevPage() {
    if (step.value === stepOne) return;
    step.value = step.value - 1;
}
/**
 * goes to next page
 */
function nextPage() {
    step.value = step.value + 1;
}
/**
 * Creates a new label
 */
function createLabel() {
    if (labelInput.value.length === 0 || labelInput.value.length > 50) {
        toast(
            "Label name must be filled in and can not be longer than 50 characters",
            "warning",
        );
        return;
    }
    if (
        burrowData.value.labels
            .map((label) => label.name)
            .includes(labelInput.value)
    ) {
        toast("Label already exists", "warning");
        return;
    }
    const colorWithoutHash = colorRef.value.replace("#", "");
    if (colorWithoutHash.length !== 6) {
        toast("Invalid color code", "warning");
        return;
    }
    const label: newLabel = {
        name: labelInput.value,
        color: colorWithoutHash,
    };
    burrowData.value.labels.push(label);
    labelInput.value = "";
}
/**
 * will check if all data is correct in this step
 */
function checkStepOne() {
    if (
        burrowData.value.name.length > 25 ||
        burrowData.value.name.length === 0 ||
        burrowData.value.name.includes(" ")
    ) {
        toast(
            "Burrow name can not exceed 25 characters, must be filled in and can not contain spaces",
            "warning",
        );

        return;
    }
    if (
        burrowData.value.description.length > 150 ||
        burrowData.value.description.length === 0
    ) {
        toast(
            "Burrow description can not exceed 150 characters and must be filled in",
            "warning",
        );
        return;
    }
    nextPage();
    return;
}
/**
 * will check if all data is correct in this step
 */
function checkStepTwo() {
    if (burrowData.value.avatar.length === 0) {
        toast("Burrow avatar must be filled in", "warning");
        return;
    }
    if (burrowData.value.banner.length === 0) {
        toast("Burrow banner must be filled in", "warning");
        return;
    }
    nextPage();
    return;
}
/**
 * will check if all data is correct in this step
 */
function checkStepThree() {
    if (burrowData.value.tags.length === 0 || searchBurrow.value.length > 10) {
        toast(
            "Burrow tags must be filled in and can not be more than 10",
            "warning",
        );
        return;
    }
    nextPage();
    return;
}
/**
 * will check if all data is correct in this step
 */
function checkStepFour() {
    if (burrowData.value.labels.length > 10) {
        toast("Burrow labels can not be more than 10", "warning");
        return;
    }
    if (burrowData.value.labels.length === 0) {
        toast("A burrow must have at least one label", "warning");
        return;
    }
    nextPage();
    return;
}
/**
 * Creates the burrow with tags and labels
 */
async function createBurrow() {
    if (userStore.isLoggedIn === false) {
        toast("Please log in to create a post.", "warning");
        return;
    }
    const formData = new FormData();
    const payload: newBurrow = {
        hopper_id: userStore.user.id,
        name: burrowData.value.name,
        description: burrowData.value.description,
        tags: burrowData.value.tags,
        avatar: burrowData.value.avatar,
        banner: burrowData.value.banner,
        isNsfwAllowed: burrowData.value.isNsfwAllowed,
        labels: burrowData.value.labels,
    };
    formData.append("createBurrowPayload", JSON.stringify(payload));
    if (avatarFile.value) {
        formData.append("avatarFile", avatarFile.value);
    }
    if (bannerFile.value) {
        formData.append("bannerFile", bannerFile.value);
    }
    try {
        await useFetchBurrowCreate(formData);
        toast("Burrow created successfully", "success", 5);
        emit("close");
        Object.assign(burrowData, {
            hopper_id: userStore.user.id,
            name: "",
            description: "",
            tags: [],
            avatar: "",
            banner: "",
            isNsfwAllowed: false,
            labels: [],
        });
        searchBurrow.value = "";
        labelInput.value = "";
        avatarFile.value = null;
        bannerFile.value = null;
        colorRef.value = "#FFFFFF";
    } catch (error) {
        toast(
            (error as { message?: string })?.message ||
            "Failed to create burrow. Please try again.",
            "danger",
        );
    }
}
</script>

<template>
<Teleport to="body">
    <div v-if="props.open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-scroll">
        <div
            class="w-full max-w-3xl z-50 rounded-xl bg-fill px-6 py-4 text-font shadow-xl relative max-h-[calc(100vh-10rem)] overflow-auto">
            <button class="absolute top-4 right-4 text-2xl text-font hover:text-red-400" @click="emit('close')">
                &times;
            </button>
            <div v-if="step === stepOne">
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl font-semibold">
                        Tell us about your Burrow
                    </h1>
                    <div class="text-font-light mb-2 text-sm">
                        A name and description help hoppers understand what your
                        burrow is all about. please think about the name, this
                        can not be changed later unlike the rest of your burrow.
                    </div>
                </div>
                <div class="flex gap-2">
                    <div class="flex flex-col w-full max-w-[30rem]">
                        <Input v-model="burrowData.name" fill small-text :label="'Burrow Name'"
                            :placeholder="'Burrow Name'" :required="true" :max-length="25" type="text"
                            color="Ebony Clay" class="mb-8" />
                        <Textarea v-model="burrowData.description" fill small-text :label="'Burrow Description'"
                            :placeholder="'Burrow Description'" :required="true" type="text" :rich-text="false"
                            :max-length="150" color="Ebony Clay" class="mb-8" />
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-4">
                    <Button color="orange" :disabled="false" :fill="false" iconposition="right" label="Cancel"
                        size="large" variant="outline" @click="emit('close')" />
                    <Button color="orange" :fill="false" iconposition="right" label="Next" size="large"
                        variant="primary" @click="checkStepOne()" />
                </div>
            </div>
            <div v-if="step === stepTwo">
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl font-semibold">
                        Burrow Avatar
                    </h1>
                    <div class="text-font-light mb-2 text-sm">
                        A burrow avatar helps hoppers identify your burrow.
                    </div>
                </div>
                <Textarea v-model="avatarFile" fill smallText :label="'Burrow Avatar'" :required="false" type="image"
                    :rich-text="false" color="Ebony Clay" class="mb-8" @change="setMediaFile($event, 'avatar')" />
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl font-semibold">
                        Burrow banner
                    </h1>
                    <div class="text-font-light mb-2 text-sm">
                        A burrow banner helps hoppers to connect with your
                        burrow.
                    </div>
                </div>
                <Textarea v-model="bannerFile" fill smallText :label="'Burrow banner'" :required="false" type="image"
                    :rich-text="false" color="Ebony Clay" class="mb-8" @change="setMediaFile($event, 'banner')" />

                <div class="flex justify-end gap-2 mt-4">
                    <Button color="orange" :disabled="false" :fill="false" label="Back" size="large" variant="outline"
                        @click="prevPage" />
                    <Button color="orange" :fill="false" label="Next" size="large" variant="primary"
                        @click="checkStepTwo()" />
                </div>
            </div>
            <div v-if="step === stepThree">
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl font-semibold">
                        Burrow Tags
                    </h1>
                    <div class="text-font-light mb-2 text-sm">
                        Tags help hoppers to find your burrow and know what it
                        is all about
                    </div>
                </div>
                <Input v-model="searchBurrow" fill smallText icon :label="'Burrow Tags'" :placeholder="'Burrow Tags'"
                    :required="false" type="text" color="Ebony Clay" class="mb-8" />
                <div class="flex flex-wrap mt-2 mb-6">
                    <div v-for="tag in burrowData.tags" :key="tag.id"
                        class="h-6 mt-2 ml-2 bg-orange-950 text-brand px-3 flex items-center text-xs rounded-full whitespace-nowrap">
                        {{ tag.name }}
                        <button type="button" @click="removeTag(tag)" class="ml-2 text-brand focus:outline-none"
                            :aria-label="`Remove ${tag.name}`">
                            &times;
                        </button>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 h-80 overflow-scroll">
                    <Button v-for="(tag, index) in filteredTags" :key="index" :label="tag.name" size="large" :variant="burrowData.tags.some((t) => t.id === tag.id)
                        ? 'primary'
                        : 'outline'
                        " :fill="false" class="transition-all" @click="toggleTag(tag)" />
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <Button color="orange" :disabled="false" :fill="false" label="Back" size="large" variant="outline"
                        @click="prevPage" />
                    <Button color="orange" :fill="false" label="Next" size="large" variant="primary"
                        @click="checkStepThree()" />
                </div>
            </div>
            <div v-if="step === stepFour">
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl font-semibold">
                        Create labels
                    </h1>
                    <div class="text-font-light mb-2 text-sm">
                        You can create labels for your burrow to help hoppers
                        with their posts
                    </div>
                </div>
                <Input v-model="labelInput" fill smallText :label="'Label name'" :placeholder="'Burrow Tags'"
                    :required="false" type="text" color="Ebony Clay" class="mb-4" />
                <div class="flex row items-center m-2">
                    <label for="hs-color-input" class="block text-sm font-medium mb-2 dark:text-white">Color
                        picker</label>
                    <input v-model="colorRef" type="color"
                        class="ml-4 h-10 w-14 block bg-none border border-none cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700" />
                </div>
                <Button label="Add label" size="large" :variant="'primary'" :fill="false" class="transition-all"
                    @click="createLabel()" />

                <div class="flex flex-wrap mt-2 mb-6">
                    <div v-for="label in burrowData.labels" :key="label.name"
                        class="h-6 mt-2 px-3 flex items-center text-xs rounded-full whitespace-nowrap"
                        :class="[getTextColor(label.color)]" :style="{
                            backgroundColor: `#${label.color}`,
                        }">
                        {{ label.name }}
                        <button type="button" @click="removeLabel(label)" class="ml-2 focus:outline-none"
                            :class="getTextColor(label.color)" :aria-label="`Remove ${label.name}`">
                            &times;
                        </button>
                    </div>
                </div>
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl">18+ content</h1>
                    <div class="text-font-light mb-2 text-sm">
                        Do you want to allow 18+ content in your burrow?
                    </div>
                </div>
                <label class="mt-2 inline-flex items-center me-5 cursor-pointer">
                    <input v-model="burrowData.isNsfwAllowed" type="checkbox" value="" class="sr-only peer" checked />
                    <div
                        class="relative w-11 h-6 bg-font-disabled rounded-full peer peer-focus:ring-4 peer-focus:ring-brand dark:peer-focus:ring-brand dark:bg-fill-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-font after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-border peer-checked:bg-brand-hover dark:peer-checked:bg-brand-hover">
                    </div>
                    <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">18+</span>
                </label>

                <div class="flex justify-end gap-2 mt-4">
                    <Button color="orange" :disabled="false" :fill="false" label="Back" size="large" variant="outline"
                        @click="prevPage" />
                    <Button color="orange" :fill="false" label="preview" size="large" variant="primary"
                        @click="checkStepFour()" />
                </div>
            </div>
            <div v-if="step === stepFive">
                <div class="mt-4 mb-4">
                    <h1 class="text-font mb-0 text-xl">Preview Your Burrow</h1>
                    <div class="text-font-light mb-2 text-sm">
                        Here's what your burrow will look like to other Hoppers.
                    </div>
                </div>
                <div class="flex justify-center">
                    <div class="rounded-xl overflow-hidden shadow-lg w-full max-w-xl border border-fill-light">
                        <div class="w-full h-32 bg-gray-200">
                            <img v-if="bannerFile" :src="createImg('banner')" alt="Banner"
                                class="object-cover w-full h-full" />
                        </div>
                        <div class="relative p-4">
                            <div class="absolute -top-12 left-4">
                                <img v-if="avatarFile" :src="createImg('avatar')" alt="Avatar"
                                    class="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover" />
                            </div>
                            <div class="mt-10 ml-24">
                                <h2 class="text-xl font-semibold text-font truncate">
                                    {{
                                        "b/" + burrowData.name ||
                                        "MyAwesomeBurrow"
                                    }}
                                </h2>
                                <p class="text-sm text-font-light mt-1">
                                    1 member - 1 online
                                </p>
                                <p class="text-sm text-font mt-2 break-words">
                                    {{
                                        burrowData.description ||
                                        "This is where cool hoppers gather."
                                    }}
                                </p>
                                <div class="mt-2 text-sm text-font-light">
                                    Tags:
                                </div>
                                <div class="flex flex-wrap mt-2 gap-1">
                                    <span v-for="tag in burrowData.tags" :key="tag.id"
                                        class="px-2 py-1 bg-brand text-white text-xs rounded-full">
                                        {{ tag.name }}
                                    </span>
                                </div>
                                <div class="mt-2 text-sm text-font-light">
                                    Labels:
                                </div>
                                <div class="flex flex-wrap mt-2 gap-1">
                                    <span v-for="label in burrowData.labels" :key="label.name"
                                        class="px-2 py-1 text-xs rounded-full" :style="{
                                            backgroundColor: '#' + label.color,
                                        }" :class="getTextColor(label.color)">
                                        {{ label.name }}
                                    </span>
                                </div>
                                <div v-if="burrowData.isNsfwAllowed" class="mt-2 text-xs text-red-500 font-bold">
                                    18+ content allowed
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end gap-2 mt-6">
                    <Button color="orange" :disabled="false" :fill="false" label="Back" size="large" variant="outline"
                        @click="prevPage()" />
                    <Button color="orange" :fill="false" label="Create Burrow" size="large" variant="primary"
                        @click="createBurrow()" />
                </div>
            </div>
            <div class="flex justify-center mt-2">
                <div v-for="stepIndex in 5" :key="stepIndex" class="mx-1">
                    <div :class="[
                        'w-6 h-6 text-xs rounded-full flex items-center justify-center',
                        step === stepIndex
                            ? 'bg-orange-500 text-white'
                            : 'bg-main text-font-light ',
                    ]">
                        {{ stepIndex }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</Teleport>
</template>
