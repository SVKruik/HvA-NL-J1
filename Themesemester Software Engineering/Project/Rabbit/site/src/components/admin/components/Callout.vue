<script lang="ts" setup>
import { cva, type VariantProps } from "class-variance-authority";
import { concatStyling } from "../../../utils/concatStyling";

const calloutVariants = cva(
    "w-full border mt-4 gap-2 rounded-lg p-4 flex flex-row items-center",
    {
        variants: {
            variant: {
                error: "bg-red-950 border-red-500",
                warning: "bg-yellow-950 border-yellow-500",
            },
        },
    },
);

const calloutIconVariants = cva(
    "size-8 flex justify-center items-center rounded",
    {
        variants: {
            variant: {
                error: "bg-red-500",
                warning: "bg-yellow-500",
            },
        },
    },
);

type ButtonProps = VariantProps<typeof calloutVariants>;

withDefaults(
    defineProps<{
        classname?: string;
        variant?: ButtonProps["variant"];
        title: string;
        description: string;
    }>(),
    {
        classname: "",
        variant: "warning",
    },
);
</script>

<template>
    <div :class="concatStyling(calloutVariants({ variant }), classname)">
        <div :class="calloutIconVariants({ variant })">
            <i v-if="variant === 'error'" class="fi fi-sr-exclamation size-4 mb-1" />
            <i v-else class="fi fi-sr-info size-4 mb-1" />
        </div>
        <div>
            <h1 class="text-sm font-bold">{{ title }}</h1>
            <p class="text-xs text-gray-400">
                {{ description }}
            </p>
        </div>
    </div>
</template>
