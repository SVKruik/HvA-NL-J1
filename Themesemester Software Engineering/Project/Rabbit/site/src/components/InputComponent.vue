<script lang="ts" setup>
import { cva } from "class-variance-authority";
import { computed, ref, watch } from "vue";

type InputType = "text" | "image & video" | "URL";

interface Props {
    label: string;
    required?: boolean;
    color?: "Ebony Clay" | "Bunker";
    icon?: boolean;
    maxLength?: number;
    smallText?: boolean;
    size?: "small" | "medium" | "large";
    fill?: boolean;
    type?: InputType;
    modelValue?: string | File | null;
}

const props = withDefaults(defineProps<Props>(), {
    required: false,
    color: "Ebony Clay",
    icon: false,
    maxLength: 0,
    smallText: false,
    size: "medium",
    fill: false,
    type: "text",
    modelValue: "",
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string | File | null): void;
}>();

const inputType = ref<InputType>(props.type);
const inputValue = ref(
    typeof props.modelValue === "string" ? props.modelValue : "",
);
const isFocused = ref(false);
const file = ref<File | null>(
    props.modelValue instanceof File ? props.modelValue : null,
);
const link = ref("");
const linkIsValid = ref<boolean | null>(null);

watch(
    () => props.type,
    (newType) => {
        inputType.value = newType;
    },
    { immediate: true },
);

watch(inputValue, (newVal) => {
    if (inputType.value !== "image & video") {
        emit("update:modelValue", newVal);
    }
});

watch(file, (newFile) => {
    if (inputType.value === "image & video") {
        emit("update:modelValue", newFile);
    }
});

function validateLink() {
    try {
        const url = new URL(link.value);
        linkIsValid.value = ["http:", "https:"].includes(url.protocol);
    } catch {
        linkIsValid.value = false;
    }
}

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    file.value = target.files?.[0] || null;
}

const charCount = computed(() => inputValue.value.length);

const inputVariants = cva(
    "block p-4 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white placeholder-transparent outline-none border-none",
    {
        variants: {
            color: {
                "Ebony Clay": "bg-[#2E3745]",
                Bunker: "bg-[#161B22]",
            },
            size: {
                small: "text-sm h-8",
                medium: "text-base h-10",
                large: "text-lg h-14",
            },
            fill: {
                false: "w-15",
                true: "w-full",
            },
        },
    },
);

const labelVisable = computed(() => {
    if (props.smallText) {
        return props.smallText;
    }
    return inputValue.value.length === 0 && !props.smallText;
});
</script>

<template>
    <div>
        <div class="relative">
            <label
                v-if="
                    labelVisable &&
                    (props.type === 'text' || props.type === 'URL')
                "
                :for="props.label"
                class="absolute transition-all duration-200 text-sm text-gray-400 pointer-events-none"
                :class="[
                    (inputValue.length > 0 || isFocused) && props.smallText
                        ? 'text-xs top-[2px] scale-[0.85] -ml-[6px]'
                        : 'top-1/2 -translate-y-1/2',
                    props.icon ? 'left-10' : 'left-4',
                ]"
            >
                {{ props.label }}
                <span v-if="props.required" class="text-red-500">*</span>
            </label>

            <div v-if="inputType === 'text'">
                <div
                    v-if="props.icon"
                    class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                    <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                    </svg>
                </div>

                <input
                    :id="props.label"
                    v-model="inputValue"
                    class="h-8 lg:h-10"
                    type="text"
                    :maxlength="props.maxLength || undefined"
                    :class="[
                        inputVariants({
                            color: props.color,
                            size: props.size,
                            fill: props.fill,
                        }),
                        props.icon ? 'ps-10' : 'ps-4',
                        props.smallText ? 'h-12 py-3' : 'h-10',
                    ]"
                    :required="props.required"
                    :aria-label="props.label"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                />
            </div>

            <div v-if="inputType === 'image & video'" class="relative">
                <label
                    class="flex items-center justify-center text-font"
                    :class="
                        inputVariants({
                            color: props.color,
                            size: props.size,
                            fill: props.fill,
                        })
                    "
                >
                    Click to upload image or video
                    <input
                        type="file"
                        accept="image/*,video/*"
                        class="absolute inset-0 opacity-0 cursor-pointer"
                        :required="props.required"
                        @change="handleFileChange($event)"
                    />
                </label>
            </div>

            <div v-else-if="inputType === 'URL'">
                <input
                    id="text"
                    v-model="inputValue"
                    type="text"
                    :maxlength="props.maxLength || undefined"
                    :class="[
                        inputVariants({
                            color: props.color,
                            size: props.size,
                            fill: props.fill,
                        }),
                        props.icon ? 'ps-10' : 'ps-4',
                        props.smallText ? 'h-12 py-3' : 'h-10',
                    ]"
                    :required="props.required"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                    @input="validateLink"
                />
                <p
                    v-if="link"
                    :class="{
                        'text-green-400': linkIsValid,
                        'text-red-400': linkIsValid === false,
                    }"
                    class="text-xs mt-1"
                >
                    {{
                        linkIsValid === null
                            ? ""
                            : linkIsValid
                              ? "Valid URL"
                              : "Invalid URL"
                    }}
                </p>
            </div>
        </div>
        <div
            v-if="inputType === 'text' && props.maxLength > 0"
            class="flex text-xs text-gray-400 justify-end mt-1"
        >
            {{ charCount }}/{{ props.maxLength }}
        </div>
    </div>
</template>
