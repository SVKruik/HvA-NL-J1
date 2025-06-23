<script setup lang="ts">
const props = defineProps<{
    options: { label: string; icon?: string; style?: string; value: string }[];
    small?: boolean;
}>();

const emit = defineEmits<{
    (e: "select", value: string): void;
}>();

const isOpen = ref(false);

/**
 * Toggles the visibility of the dropdown menu.
 * This function switches the `isOpen` state between true and false.
 */
function toggleMenu(): void {
    isOpen.value = !isOpen.value;
}

/**
 * Handles the selection of an option from the dropdown menu.
 * @param option - The selected option object containing value and label.
 * @param event - The event object to stop propagation.
 */
function onSelect(
    option: { value: string },
    event: { stopPropagation: () => void },
) {
    event.stopPropagation();
    emit("select", option.value);
    toggleMenu();
}
</script>

<template>
<div :class="['text-font', props.small ? 'text-[10px]' : 'text-xs']">
    <!-- Menu Toggle Button -->
    <IconButton :class="[
        'flex justify-center items-center rounded-full font-semibold !text-font bg-fill hover:bg-fill-hover',
        props.small ? 'py-1 px-2 text-xs' : 'py-2 px-4',
    ]" variant="ghost" rounded size="medium" @click="toggleMenu">
        <i class="fi fi-ss-menu-dots"></i>
    </IconButton>

    <!-- Dropdown Menu -->
    <div v-if="isOpen" class="relative z-20">
        <ul :class="[
            'absolute bg-fill-light shadow-lg rounded-xl mt-2 right-0',
            props.small ? 'min-w-[120px]' : '',
        ]">
            <!-- Menu Option -->
            <li v-for="(option, index) in props.options" :key="index" :class="[
                'flex gap-3 cursor-pointer first:rounded-t-xl last:rounded-b-xl hover:bg-fill-hover',
                props.small
                    ? 'pl-3 py-2 px-4 text-xs'
                    : 'pl-5 py-3.5 px-8',
            ]" :style="option?.style" @click="onSelect(option, $event)">
                <!-- Option Icon -->
                <i v-if="option.icon" class="flex items-center justify-center" :class="option.icon"
                    :style="option?.style"></i>

                <!-- Option Label -->
                {{ option.label }}
            </li>
        </ul>
    </div>
</div>
</template>
