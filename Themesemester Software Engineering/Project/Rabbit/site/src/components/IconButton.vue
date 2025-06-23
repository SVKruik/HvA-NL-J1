<script lang="ts" setup>
import { cva, type VariantProps } from "class-variance-authority";
import { concatStyling } from "../utils/concatStyling";
import Button, { type ButtonProps } from "./ButtonComponent.vue";

const iconButtonVariants = cva("", {
    variants: {
        size: {
            medium: "size-8",
            large: "size-10",
        },
    },
});

export type IconButtonProps = VariantProps<typeof iconButtonVariants>;

withDefaults(
    defineProps<{
        classname?: string;
        color?: ButtonProps["color"];
        disabled?: ButtonProps["disabled"];
        size?: ButtonProps["size"];
        variant?: ButtonProps["variant"];
    }>(),
    {
        color: "fill",
        size: "large",
        variant: "primary",
        classname: "",
        disabled: false,
    },
);
</script>

<template>
    <Button :color="color" :size="size" :variant="variant" :disabled="disabled"
        :classname="concatStyling(iconButtonVariants({ size }), classname)">
        <slot />
    </Button>
</template>
