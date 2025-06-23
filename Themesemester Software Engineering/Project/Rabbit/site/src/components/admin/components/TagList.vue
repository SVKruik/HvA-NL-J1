<script setup lang="ts">
const props = defineProps<{
    tags: string[];
}>();

const visibleTags = ref<string[]>([]);
const hiddenTags = ref<string[]>([]);
const containerRef = ref<HTMLElement | null>(null);

const extraTagsButtonRef = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);
const showPopover = ref(false);
const popoverPosition = ref({ top: 0, left: 0 });

const positionPopover = () => {
    const button = extraTagsButtonRef.value;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    popoverPosition.value = {
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
    };
};

const togglePopover = () => {
    showPopover.value = !showPopover.value;
    if (showPopover.value) {
        positionPopover();
    }
};

const calculateVisibleTags = async () => {
    const container = containerRef.value;
    if (!container) return;

    let totalWidth = 0;
    const maxWidth = container.offsetWidth;

    visibleTags.value = [];
    hiddenTags.value = [];

    const tempTagStyling =
        "h-6 bg-orange-950 text-orange-500 px-3 flex items-center text-xs rounded-full whitespace-nowrap";

    const extraTagsButton = document.createElement("div");
    extraTagsButton.className = tempTagStyling;
    extraTagsButton.style.position = "absolute";
    extraTagsButton.style.visibility = "hidden";
    extraTagsButton.innerText = "+15 tags";
    document.body.appendChild(extraTagsButton);

    const extraTagsWidth = extraTagsButton.offsetWidth;
    document.body.removeChild(extraTagsButton);

    for (let i = 0; i < props.tags.length; i++) {
        const tagText = props.tags[i];
        const tempTag = document.createElement("div");
        tempTag.className = tempTagStyling;
        tempTag.style.position = "absolute";
        tempTag.style.visibility = "hidden";
        tempTag.innerText = tagText;
        document.body.appendChild(tempTag);

        const tagWidth = tempTag.offsetWidth + 8;
        document.body.removeChild(tempTag);

        if (totalWidth + tagWidth + extraTagsWidth < maxWidth) {
            totalWidth += tagWidth;
            visibleTags.value.push(tagText);
        } else {
            hiddenTags.value = props.tags.slice(visibleTags.value.length);
            break;
        }
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const popover = popoverRef.value;
    const button = extraTagsButtonRef.value;
    if (
        popover &&
        !popover.contains(event.target as Node) &&
        button &&
        !button.contains(event.target as Node)
    ) {
        showPopover.value = false;
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
    calculateVisibleTags();
});

onBeforeUnmount(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
    <div ref="containerRef" class="flex gap-1 overflow-hidden">
        <div
            v-for="(tag, index) in visibleTags"
            :key="index"
            class="h-6 bg-orange-950 text-orange-500 px-3 flex items-center text-xs rounded-full whitespace-nowrap"
        >
            {{ tag }}
        </div>

        <div
            v-if="hiddenTags.length"
            ref="extraTagsButtonRef"
            class="h-6 bg-orange-950 text-orange-500 px-3 flex items-center text-xs rounded-full whitespace-nowrap cursor-pointer"
            @click="togglePopover"
        >
            +{{ hiddenTags.length }} tags
        </div>
    </div>

    <div
        v-if="showPopover"
        ref="popoverRef"
        class="absolute z-10"
        :style="{
            position: 'absolute',
            top: `${popoverPosition.top}px`,
            left: `${popoverPosition.left}px`,
            transform: 'translateX(-50%)',
        }"
    >
        <div
            class="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-fill-light mx-auto"
        ></div>

        <div class="rounded-lg bg-fill-light w-32 p-1 flex flex-col gap-1">
            <div
                v-for="(tag, index) in hiddenTags"
                :key="index"
                class="h-6 bg-orange-950 truncate text-orange-500 px-3 flex items-center justify-center text-xs rounded-full whitespace-nowrap"
            >
                {{ tag }}
            </div>
        </div>
    </div>
</template>
