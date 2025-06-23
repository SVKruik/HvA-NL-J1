<script lang="ts" setup>
defineProps<{
    birthday: string;
}>();
</script>

<template>
    <div
        v-if="isAccoundBirthday(birthday)"
        class="relative group text-sm text-font font-semibold"
    >
        <i class="fi fi-sr-carrot text-brand"></i>
        <span
            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded-lg border border-font-light opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100 transition-all duration-200 z-20"
            role="tooltip"
        >
            This Hopper's birthday is today
            <span
                class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 border-b border-r border-font-light border-l-0 border-t-0 rotate-45 z-[-1]"
                style="margin-top: -0.2rem"
            ></span>
        </span>
    </div>
</template>
