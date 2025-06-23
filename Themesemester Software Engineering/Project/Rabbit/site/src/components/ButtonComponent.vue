<script lang="ts" setup>
import { cva, type VariantProps } from "class-variance-authority";
import { concatStyling } from "../utils/concatStyling";

const buttonVariants = cva(
    "font-normal flex justify-center items-center font-medium",
    {
        variants: {
            size: {
                medium: "text-xs h-8 px-3 gap-1.5",
                large: "text-sm h-10 px-4 gap-2",
            },
            variant: {
                primary: "text-white",
                secondary: "",
                outline: "",
                ghost: "",
            },
            color: {
                orange: "",
                fill: "",
            },
            fill: {
                false: "",
                true: "w-full",
            },
            disabled: {
                false: "",
                true: "cursor-not-allowed",
            },
            rounded: {
                false: "rounded-lg",
                true: "rounded-3xl",
            }
        },
        compoundVariants: [
            {
                variant: "primary",
                color: "orange",
                class: "bg-brand hover:bg-brand-hover active:bg-brand-hover",
            },
            {
                variant: "outline",
                color: "orange",
                class: "bg-transparent hover:border-orange-600 active:border-orange-700 border border-orange-500 text-orange-500",
            },
            {
                variant: "secondary",
                color: "orange",
                class: "bg-brand-alt hover:bg-brand-alt-hover active: active:bg-brand-alt-hover text-font",
            },
            {
                variant: "ghost",
                color: "orange",
                class: "bg-transparent hover:bg-orange-50 active:bg-orange-100 text-orange-500",
            },
            {
                variant: "primary",
                color: "fill",
                class: "bg-fill hover:bg-fill-hover active:bg-fill-active",
            },
        ],
    },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;

withDefaults(
    defineProps<{
        classname?: string;
        color?: ButtonProps["color"];
        disabled?: ButtonProps["disabled"];
        fill?: ButtonProps["fill"];
        label?: string;
        rounded?: boolean;
        size?: ButtonProps["size"];
        variant?: ButtonProps["variant"];
        iconposition?: "left" | "right";
    }>(),
    {
        color: "orange",
        size: "large",
        variant: "primary",
        iconposition: "left",
        classname: "",
        disabled: false,
        rounded: false,
        fill: false,
        label: "",
    },
);
</script>

<template>
    <button type="button" :class="concatStyling(
        buttonVariants({
            size,
            variant,
            color,
            fill,
            disabled,
            rounded,
        }),
        classname)">
        <slot v-if="iconposition == 'left'" />
        <p v-if="label">{{ label }}</p>
        <slot v-if="iconposition == 'right'" />
    </button>
</template>
