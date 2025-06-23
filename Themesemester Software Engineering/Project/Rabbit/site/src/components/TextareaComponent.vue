<script lang="ts" setup>
import { cva } from "class-variance-authority";
import type { FileTypes, TextareaType } from "../assets/customTypes";
import { computed, onMounted, ref, watch } from "vue";

interface Props {
    label: string;
    required?: boolean;
    color?: "Ebony Clay" | "Bunker";
    maxLength?: number;
    smallText?: boolean;
    size?: "small" | "medium" | "large";
    fill?: boolean;
    type?: TextareaType;
    modelValue?: string | File | null;
    richText?: boolean;
    fileType?: FileTypes;
}

const props = withDefaults(defineProps<Props>(), {
    required: false,
    color: "Ebony Clay",
    maxLength: 0,
    smallText: false,
    size: "medium",
    fill: false,
    type: "text",
    modelValue: "",
    richText: false,
});
defineOptions({ inheritAttrs: false });
const emit = defineEmits<{
    (e: "update:modelValue", value: string | File | null): void;
    (e: "change", event: Event): void;
}>();

const textareaType = ref<TextareaType>(props.type);
const htmlValue = ref(
    typeof props.modelValue === "string" ? props.modelValue : "",
);

const file = ref<File | null>(
    props.modelValue instanceof File ? props.modelValue : null,
);
const fileString = ref<string | null>(
    typeof props.modelValue === "string" ? props.modelValue : null,
);
const isFocused = ref(false);
const editorRef = ref<HTMLDivElement | null>(null);
const innerText = ref("");

const boldRef = ref(false);
const italicRef = ref(false);
const underlineRef = ref(false);
const strikeThroughRef = ref(false);
const linkRef = ref(false);

watch(
    () => props.type,
    (newType) => {
        textareaType.value = newType;
    },
    { immediate: true },
);

watch(
    () => props.modelValue,
    (newVal) => {
        if (
            textareaType.value === "text" &&
            editorRef.value &&
            typeof newVal === "string" &&
            !isFocused.value &&
            editorRef.value.innerHTML !== newVal
        ) {
            editorRef.value.innerHTML = newVal;
            innerText.value = editorRef.value?.innerText?.trim() || "";
        }
    },
);
onMounted(() => {
    if (editorRef.value && typeof props.modelValue === "string") {
        editorRef.value.innerHTML = props.modelValue;
        innerText.value = editorRef.value?.innerText?.trim() || "";
    }
});

watch(file, (newFile) => {
    if (
        (textareaType.value === "image" || textareaType.value === "video") &&
        newFile
    ) {
        emit("update:modelValue", newFile);
    }
});

const labelClasses = computed(() => {
    if (!props.smallText) return "top-7 -translate-y-1/2";
    return innerText.value.trim() || isFocused.value
        ? "text-xs top-[2px] scale-[0.85] -ml-[8px]"
        : "top-6 -translate-y-1/2";
});

const textareaVariants = cva(
    "block p-4 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-transparent min-h-[5rem] outline-none border-none",
    {
        variants: {
            color: {
                "Ebony Clay": "bg-fill-light",
                Bunker: "bg-fill",
            },
            size: {
                small: "text-sm",
                medium: "text-base",
                large: "text-lg",
            },
            sizeH: {
                small: "h-20",
                medium: "h-32",
                large: "h-48",
            },
            fill: {
                false: "w-auto max-w-sm",
                true: "w-full",
            },
        },
    },
);

const boldVariants = cva("border-b border-gray-600 bg-[#1f2937] rounded-t-lg", {
    variants: {
        color: {
            "Ebony Clay": "bg-fill-light",
            Bunker: "bg-fill",
        },
        size: {
            small: "text-sm",
            medium: "text-base",
            large: "text-lg",
        },
        fill: {
            false: "w-auto max-w-sm",
            true: "w-full",
        },
    },
});
const previewUrl = computed(() => {
    if (file.value) {
        return URL.createObjectURL(file.value);
    }
    if (fileString.value && props.fileType) {
        if (getFilePath(fileString.value, props.fileType).length > 0) {
            return getFilePath(fileString.value, props.fileType);
        }
        return fallbackImage(props.fileType);
    }
    return null;
});

const execFormat = (command: string) => {
    const editor = editorRef.value;
    if (!editor) return;
    editor.focus();

    switch (command) {
        case "bold":
            boldRef.value = !boldRef.value;
            break;
        case "italic":
            italicRef.value = !italicRef.value;
            break;
        case "underline":
            underlineRef.value = !underlineRef.value;
            break;
        case "strikeThrough":
            strikeThroughRef.value = !strikeThroughRef.value;
            break;
        case "link":
            linkRef.value = !linkRef.value;
            break;
    }

    document.execCommand(command, false);
};

const updateHtml = () => {
    if (textareaType.value === "text" && editorRef.value) {
        htmlValue.value = editorRef.value.innerHTML;
        innerText.value = editorRef.value?.innerText?.trim() || "";
        emit("update:modelValue", htmlValue.value);
    } else if (
        (textareaType.value === "image" || textareaType.value === "video") &&
        file.value
    ) {
        emit("update:modelValue", file.value);
    } else {
        emit("update:modelValue", null);
    }
};

const handleBeforeInput = (event: Event) => {
    if (!editorRef.value || props.maxLength <= 0) return;

    const inputEvent = event as InputEvent;
    const currentLength = editorRef.value.innerText.length;
    const inputType = inputEvent.inputType;
    if (inputType.startsWith("delete")) return;

    const data = inputEvent.data || "";
    const selection = window.getSelection();
    const selectedLength = selection?.toString().length || 0;
    const newLength = currentLength - selectedLength + data.length;

    if (newLength > props.maxLength) {
        event.preventDefault();
    }
};

const charCount = computed(() => innerText.value.length);
const labelVisible = computed(() =>
    !props.smallText && innerText.value ? false : true,
);

const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const selectedFile = target?.files?.[0] || null;
    file.value = selectedFile;

    emit("change", event);
    emit("update:modelValue", selectedFile);
    target.value = "";
};
</script>

<template>
    <div
        v-if="textareaType === 'text' && props.richText"
        v-bind="$attrs"
        :class="[
            boldVariants({
                color: props.color,
                size: props.size,
                fill: props.fill,
            }),
        ]"
    >
        <div class="flex gap-2 px-4 py-2">
            <button
                type="button"
                class="text-sm font-medium px-1 rounded transition"
                :class="
                    boldRef
                        ? 'text-blue-400 font-bold'
                        : 'text-white hover:text-blue-400'
                "
                @click="execFormat('bold')"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                class="text-sm font-medium px-1 rounded transition"
                :class="
                    italicRef
                        ? 'text-blue-400 italic'
                        : 'text-white hover:text-blue-400'
                "
                @click="execFormat('italic')"
            >
                <em>I</em>
            </button>
            <button
                type="button"
                class="text-sm font-medium px-1 rounded transition"
                :class="
                    underlineRef
                        ? 'text-blue-400 underline'
                        : 'text-white hover:text-blue-400'
                "
                @click="execFormat('underline')"
            >
                <u>U</u>
            </button>
            <button
                type="button"
                class="text-sm font-medium px-1 rounded transition"
                :class="
                    strikeThroughRef
                        ? 'text-blue-400 underline'
                        : 'text-white hover:text-blue-400'
                "
                @click="execFormat('strikeThrough')"
            >
                &minus;
            </button>
        </div>
    </div>

    <div class="relative" v-bind="$attrs">
        <label
            v-if="props.label && labelVisible"
            for="editor"
            class="absolute transition-all duration-200 text-sm text-gray-400 pointer-events-none left-4"
            :class="labelClasses"
        >
            {{ props.label }}
            <span v-if="props.required" class="text-red-500">*</span>
        </label>

        <div v-if="textareaType === 'text'">
            <div
                id="editor"
                ref="editorRef"
                contenteditable="true"
                :class="[
                    textareaVariants({
                        color: props.color,
                        size: props.size,
                        fill: props.fill,
                        sizeH: props.size,
                    }),
                    richText
                        ? 'rounded-t-none overflow-auto break-words whitespace-pre-wrap m-0'
                        : 'rounded-lg overflow-auto break-words whitespace-pre-wrap m-0',
                ]"
                @beforeinput="handleBeforeInput"
                @input="updateHtml"
                @focus="isFocused = true"
                @blur="isFocused = false"
            ></div>

            <div
                v-if="props.maxLength > 0"
                class="text-xs text-gray-400 flex justify-end mt-1"
            >
                {{ charCount }}/{{ props.maxLength }}
            </div>
        </div>

        <div
            v-if="textareaType === 'image' || textareaType === 'video'"
            class="relative"
        >
            <div
                class="relative border rounded-lg overflow-hidden"
                :class="
                    textareaVariants({ color: props.color, fill: props.fill })
                "
            >
                <template v-if="previewUrl">
                    <button
                        class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded z-10"
                        @click="
                            file = null;
                            emit('update:modelValue', null);
                            fileString = null;
                        "
                    >
                        Remove
                    </button>
                    <template
                        v-if="
                            previewUrl &&
                            (textareaType === 'image' ||
                                file?.type?.startsWith('image/'))
                        "
                    >
                        <img
                            :src="previewUrl"
                            alt="Preview"
                            class="w-full object-contain"
                        />
                    </template>
                    <template
                        v-else-if="
                            previewUrl &&
                            (textareaType === 'video' ||
                                file?.type?.startsWith('video/'))
                        "
                    >
                        <video
                            :src="previewUrl"
                            controls
                            class="w-full object-contain"
                        />
                    </template>
                </template>

                <template v-else>
                    <label
                        class="flex items-center justify-center size-full cursor-pointer text-font-light"
                    >
                        <span>Click to upload {{ textareaType }}</span>
                        <input
                            type="file"
                            :accept="
                                textareaType === 'image'
                                    ? 'image/*'
                                    : textareaType === 'video'
                                      ? 'video/*'
                                      : ''
                            "
                            class="absolute inset-0 opacity-0 cursor-pointer"
                            :required="props.required"
                            @change="onFileChange"
                        />
                    </label>
                </template>
            </div>
        </div>
    </div>
</template>
