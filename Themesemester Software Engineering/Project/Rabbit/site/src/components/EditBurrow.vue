<script lang="ts" setup>
import {
    ButtonComponent as Button,
    InputComponent as Input,
    TextareaComponent as Textarea,
} from "#components";
import { useFetchTag } from "~/utils/fetch/tag/useFetchTag";
import {
    type Tag,
    type newLabel,
    type BurrowApi,
    FileTypes,
    type Burrow,
} from "../assets/customTypes";
import { getTextColor } from "~/utils/format";
import { useFetchBurrowTags } from "~/utils/fetch/burrow/useFetchBurrowTags";
import { useFetchBurrowLabels } from "~/utils/fetch/burrow/useFetchBurrowLabels";
import { useFetchAlterBurrow } from "~/utils/fetch/burrow/useFetchAlterBurrow";

const menuItems = [
    "Description",
    "Images",
    "Tags",
    "Labels",
    "NSFW",
    "Rules",
    "Keepers",
];

const selected = ref("Description");
const showConfirmModal = ref(false);
const update = ref(false);
const tags = ref<Tag[]>([]);
const startTags = ref<Tag[]>([]);
const startLables = ref<newLabel[]>([]);
const searchBurrow = ref("");
const labelInput = ref("");
const colorRef = ref("#FFFFFF");
const avatarFile = ref<File | null>(null);
const bannerFile = ref<File | null>(null);
const newRule = ref("");
const localRules = ref<string[]>([]);

const userStore = useUserStore();
const { $event } = useNuxtApp();
const props = withDefaults(
    defineProps<{
        open: boolean;
        burrow: Burrow;
        burrowId: number;
    }>(),
    {},
);

// create Toast message.
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

const burrowData = ref<BurrowApi>({
    burrow_id: props.burrowId,
    hopper_id: userStore.user.id,
    name: props.burrow.name || "",
    description: props.burrow.description || "",
    tags: [],
    avatar: props.burrow.avatar || "",
    banner: props.burrow.banner || "",
    isNsfwAllowed: props.burrow.is_nsfw_allowed || false,
    labels: [],
    rules: Array.isArray(props.burrow.rules) ? props.burrow.rules : [],
});

// Update hasChanges computed property
const hasChanges = computed(() => {
    const current = burrowData.value;
    const original = props.burrow;
    if (original.avatar === null) original.avatar = "";
    if (original.banner === null) original.banner = "";
    return (
        current.description !== original.description ||
        current.avatar !== original.avatar ||
        current.banner !== original.banner ||
        Boolean(current.isNsfwAllowed) !== Boolean(original.is_nsfw_allowed) ||
        JSON.stringify(current.tags) !== JSON.stringify(startTags.value) ||
        JSON.stringify(current.labels) !== JSON.stringify(startLables.value) ||
        JSON.stringify(localRules.value) !== JSON.stringify(original.rules)
    );
});

const emit = defineEmits<{
    (e: "close"): void;
}>();

/**
 * @description Fetches the tags, burrow tags and labels when the component is mounted.
 * @throws Will throw an error if the fetch fails.
 */
onMounted(async () => {
    try {
        const data = await useFetchTag();
        tags.value = data;
        const burrowTags = await useFetchBurrowTags(props.burrowId);
        burrowData.value.tags = [...burrowTags];
        startTags.value = [...burrowTags];
        const burrowLabels = await useFetchBurrowLabels(props.burrowId);
        burrowData.value.labels = [...burrowLabels];
        startLables.value = [...burrowLabels];
        localRules.value = [...(props.burrow.rules || [])]; // init localRules
    } catch (err) {
        const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
            (err as { message?: string })?.message ||
            "Failed to fetch burrows. Please try again.";
        toast(errorMessage, "danger");
    }
});

// filters the tags based on typed input of user
const filteredTags = computed(() => {
    if (!searchBurrow.value) return tags.value;
    const query = searchBurrow.value.toLowerCase();
    return tags.value.filter((tag) => tag.name.toLowerCase().includes(query));
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
        if (!isImage)
            throw new Error("Unsupported file type. Please upload an image");

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
 * removes label
 * @param tag - label object
 */
function removeLabel(label: newLabel) {
    burrowData.value.labels = burrowData.value.labels.filter(
        (t) => t.name !== label.name,
    );
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
 * Adds a new rule to the local list
 */
function addRule() {
    const rule = newRule.value.trim();
    if (!rule.length) return toast("Rule cannot be empty", "warning");
    if (rule.length > 200)
        return toast("Rule cannot be longer than 200 characters", "warning");
    if (localRules.value.includes(rule))
        return toast("Rule already exists", "warning");
    localRules.value.push(rule);
    newRule.value = "";
}

/**
 * Removes a rule from the local list
 * @param index - index of the rule to remove
 */
function removeRule(index: number) {
    localRules.value.splice(index, 1);
}

function OpenToggle(saveAttempt = false) {
    if (!hasChanges.value) {
        emit("close");
    } else {
        update.value = saveAttempt;
        showConfirmModal.value = true;
    }
}

// Cancels the toggle and closes the confirmation modal
function cancelToggle() {
    showConfirmModal.value = false;
}

/**
 * Updates the burrow with the new data
 * @returns {Promise<void>}
 * @description This function updates the burrow with the new data provided in the burrowData object.
 * @throws Will throw an error if the update fails.
 */
async function updateBurrow() {
    if (!userStore.isLoggedIn) {
        toast("Please log in to create a post.", "warning");
        return;
    }

    const original = props.burrow;
    const current = burrowData.value;
    const payload: BurrowApi = {
        burrow_id: props.burrowId,
        hopper_id: userStore.user.id,
        name: props.burrow.name,
        description:
            current.description === original.description
                ? ""
                : current.description,
        tags:
            JSON.stringify(current.tags) === JSON.stringify(startTags.value)
                ? []
                : current.tags,
        avatar: current.avatar === original.avatar ? "" : current.avatar,
        banner: current.banner === original.banner ? "" : current.banner,
        isNsfwAllowed: current.isNsfwAllowed,
        labels:
            JSON.stringify(current.labels) === JSON.stringify(startLables.value)
                ? []
                : current.labels,
        rules: [...localRules.value],
    };

    const formData = new FormData();
    formData.append("alterBurrowPayload", JSON.stringify(payload));

    if (avatarFile.value) {
        formData.append("avatarFile", avatarFile.value);
    }
    if (bannerFile.value) {
        formData.append("bannerFile", bannerFile.value);
    }

    try {
        await useFetchAlterBurrow(formData);
        toast("Burrow altered successfully", "success", 5);
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
            rules: [],
        });

        searchBurrow.value = "";
        labelInput.value = "";
        avatarFile.value = null;
        bannerFile.value = null;
        colorRef.value = "#FFFFFF";
        newRule.value = "";
        localRules.value = [];
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
        <div
            v-if="props.open"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-scroll"
        >
            <div
                class="w-full max-w-5xl rounded-xl bg-fill text-font shadow-xl relative h-[calc(100vh-15rem)] overflow-hidden flex"
            >
                <button
                    class="absolute top-4 right-4 text-2xl text-font hover:text-red-400"
                    @click="OpenToggle(false)"
                >
                    &times;
                </button>

                <div
                    class="w-1/4 bg-fill-light border-r border-border p-4 space-y-2"
                >
                    <h2
                        class="text-xl font-semibold text-center text-font mb-2"
                    >
                        Settings
                    </h2>
                    <div class="border-t border-font mb-4"></div>
                    <Button
                        v-for="item in menuItems"
                        :key="item"
                        :label="item"
                        :variant="selected === item ? 'primary' : 'primary'"
                        :color="selected === item ? 'orange' : 'fill'"
                        :fill="true"
                        :rounded="true"
                        :classname="
                            [
                                'transition-all duration-200 ease-in-out',
                                selected === item
                                    ? 'translate-x-2 shadow-md ml-1'
                                    : 'translate-x-0',
                            ].join(' ')
                        "
                        @click="selected = item"
                    />
                </div>

                <div class="w-3/4 p-6">
                    <div class="text-font-light text-sm">
                        <div v-if="selected === menuItems[0]">
                            <div class="mt-4 mb-4">
                                <h1
                                    class="text-font mb-0 text-xl font-semibold"
                                >
                                    Edit your burrow's description
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    A name and description help hoppers
                                    understand what your burrow is all about.
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <div class="flex flex-col w-full max-w-[30rem]">
                                    <Textarea
                                        v-model="burrowData.description"
                                        fill
                                        small-text
                                        :label="'Burrow Description'"
                                        :placeholder="'Burrow Description'"
                                        type="text"
                                        :rich-text="false"
                                        :max-length="150"
                                        color="Ebony Clay"
                                        class="mb-8"
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="selected === menuItems[1]"
                            class="overflow-scroll max-h-[600px] p-4"
                        >
                            <div class="mt-4 mb-4">
                                <h1
                                    class="text-font mb-0 text-xl font-semibold"
                                >
                                    Burrow Avatar
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    A burrow avatar helps hoppers identify your
                                    burrow.
                                </div>
                            </div>
                            <Textarea
                                :model-value="burrowData.avatar"
                                fill
                                small-text
                                :label="'Burrow Avatar'"
                                :file-type="FileTypes.burrowAvatar"
                                :required="false"
                                type="image"
                                :rich-text="false"
                                color="Ebony Clay"
                                class="mb-8"
                                @change="setMediaFile($event, 'avatar')"
                            />
                            <div class="mt-4 mb-4">
                                <h1
                                    class="text-font mb-0 text-xl font-semibold"
                                >
                                    Burrow banner
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    A burrow banner helps hoppers to connect
                                    with your burrow.
                                </div>
                            </div>
                            <Textarea
                                :model-value="burrowData.banner"
                                fill
                                small-text
                                :label="'Burrow banner'"
                                :file-type="FileTypes.burrowBanner"
                                :required="false"
                                type="image"
                                :rich-text="false"
                                color="Ebony Clay"
                                class="mb-8"
                                @change="setMediaFile($event, 'banner')"
                            />
                        </div>
                        <div v-if="selected === menuItems[2]">
                            <div class="mt-4 mb-4">
                                <h1
                                    class="text-font mb-0 text-xl font-semibold"
                                >
                                    Burrow Tags
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    Tags help hoppers to find your burrow and
                                    know what it is all about
                                </div>
                            </div>
                            <Input
                                v-model="searchBurrow"
                                fill
                                small-text
                                icon
                                :label="'Burrow Tags'"
                                :placeholder="'Burrow Tags'"
                                :required="false"
                                type="text"
                                color="Ebony Clay"
                                class="mb-8"
                            />
                            <div class="flex flex-wrap mt-2 mb-6">
                                <div
                                    v-for="tag in burrowData.tags"
                                    :key="tag.id"
                                    class="h-6 mt-2 ml-2 bg-orange-950 text-brand px-3 flex items-center text-xs rounded-full whitespace-nowrap"
                                >
                                    {{ tag.name }}
                                    <button
                                        type="button"
                                        class="ml-2 text-brand focus:outline-none"
                                        :aria-label="`Remove ${tag.name}`"
                                        @click="removeTag(tag)"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>

                            <div
                                class="flex flex-wrap gap-2 h-80 overflow-scroll"
                            >
                                <Button
                                    v-for="(tag, index) in filteredTags"
                                    :key="index"
                                    :label="tag.name"
                                    size="large"
                                    :variant="
                                        burrowData.tags.some(
                                            (t) => t.id === tag.id,
                                        )
                                            ? 'primary'
                                            : 'outline'
                                    "
                                    :fill="false"
                                    class="transition-all"
                                    @click="toggleTag(tag)"
                                />
                            </div>
                        </div>
                        <div v-if="selected === menuItems[3]">
                            <div class="mt-4 mb-4">
                                <h1
                                    class="text-font mb-0 text-xl font-semibold"
                                >
                                    Create labels
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    You can create labels for your burrow to
                                    help hoppers with their posts
                                </div>
                            </div>
                            <Input
                                v-model="labelInput"
                                fill
                                small-text
                                :label="'Label name'"
                                :placeholder="'Burrow Tags'"
                                :required="false"
                                type="text"
                                color="Ebony Clay"
                                class="mb-4"
                            />
                            <div class="flex row items-center m-2">
                                <label
                                    for="hs-color-input"
                                    class="block text-sm font-medium mb-2 dark:text-white"
                                    >Color picker</label
                                >
                                <input
                                    v-model="colorRef"
                                    type="color"
                                    class="ml-4 h-10 w-14 block bg-none border border-none cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                                />
                            </div>
                            <Button
                                label="Add label"
                                size="large"
                                :variant="'primary'"
                                :fill="false"
                                class="transition-all"
                                @click="createLabel()"
                            />

                            <div class="flex flex-wrap mt-2 mb-6">
                                <div
                                    v-for="label in burrowData.labels"
                                    :key="label.name"
                                    class="h-6 mt-2 mr-2 px-3 flex items-center text-xs rounded-full whitespace-nowrap"
                                    :class="[getTextColor(label.color)]"
                                    :style="{
                                        backgroundColor: `#${label.color}`,
                                    }"
                                >
                                    {{ label.name }}
                                    <button
                                        type="button"
                                        class="ml-2 focus:outline-none"
                                        :class="getTextColor(label.color)"
                                        :aria-label="`Remove ${label.name}`"
                                        @click="removeLabel(label)"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-if="selected === menuItems[4]">
                            <div class="mt-4 mb-4">
                                <h1 class="text-font mb-0 text-xl">
                                    18+ content
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    Do you want to allow 18+ content in your
                                    burrow?
                                </div>
                            </div>
                            <label
                                class="mt-2 inline-flex items-center me-5 cursor-pointer"
                            >
                                <input
                                    v-model="burrowData.isNsfwAllowed"
                                    type="checkbox"
                                    value=""
                                    class="sr-only peer"
                                    checked
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
                        <div v-if="selected === menuItems[5]">
                            <div class="mt-4 mb-4">
                                <h1
                                    class="text-font mb-0 text-xl font-semibold"
                                >
                                    Burrow Rules
                                </h1>
                                <div class="text-font-light mb-2 text-sm">
                                    Set rules to help maintain a positive
                                    environment in your burrow
                                </div>
                            </div>

                            <div class="flex gap-2 mb-4">
                                <Input
                                    v-model="newRule"
                                    fill
                                    small-text
                                    :label="'Add new rule'"
                                    :placeholder="'Enter a new rule'"
                                    :required="false"
                                    type="text"
                                    color="Ebony Clay"
                                    class="flex-1"
                                />
                                <Button
                                    label="Add Rule"
                                    size="large"
                                    :variant="'primary'"
                                    :fill="false"
                                    class="transition-all self-end"
                                    @click="addRule()"
                                />
                            </div>

                            <div class="space-y-2 max-h-96 overflow-scroll">
                                <div
                                    v-for="(rule, index) in localRules"
                                    :key="index"
                                    class="flex items-center justify-between p-3 bg-fill-light rounded-lg border border-border"
                                >
                                    <span class="text-font text-sm"
                                        >{{ index + 1 }}. {{ rule }}</span
                                    >
                                    <button
                                        type="button"
                                        class="text-red-400 hover:text-red-600 focus:outline-none ml-2"
                                        :aria-label="`Remove rule ${index + 1}`"
                                        @click="removeRule(index)"
                                    >
                                        &times;
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-if="selected === menuItems[6]">
                            <div class="mt-12">
                                <KeeperCopmonent
                                    :burrow="burrow"
                                    :burrow-id="burrowId"
                                />
                            </div>
                        </div>
                        <div
                            v-if="selected !== menuItems[6]"
                            class="flex justify-end gap-2 mt-4"
                        >
                            <Button
                                color="orange"
                                :disabled="false"
                                :fill="false"
                                iconposition="right"
                                label="Cancel"
                                size="large"
                                variant="outline"
                                @click="() => OpenToggle(false)"
                            />
                            <Button
                                color="orange"
                                :fill="false"
                                iconposition="right"
                                label="Save"
                                size="large"
                                variant="primary"
                                @click="() => OpenToggle(true)"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <template v-if="showConfirmModal">
                <div
                    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <div
                        class="bg-fill rounded-xl p-6 shadow-xl max-w-sm w-full text-center"
                    >
                        <p class="text-white mb-4">
                            Are you sure you want to
                            {{
                                update
                                    ? "update your burrow?"
                                    : "leave without saving?"
                            }}
                        </p>
                        <div class="flex justify-center gap-4">
                            <Button
                                label="Cancel"
                                variant="outline"
                                @click="cancelToggle"
                            />
                            <Button
                                label="Confirm"
                                color="orange"
                                @click="
                                    () => {
                                        showConfirmModal = false;
                                        if (update) {
                                            updateBurrow();
                                        } else {
                                            emit('close');
                                        }
                                    }
                                "
                            />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </Teleport>
</template>
