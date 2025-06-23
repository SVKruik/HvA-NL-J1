import { fn } from "@storybook/test";
import type { Meta, StoryObj } from "@nuxtjs/storybook";

import Button from "../components/ButtonComponent.vue";

const meta = {
    title: "Components/Button",
    component: Button,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text" },
        size: { control: "radio", options: ["medium", "large"] },
        color: {
            control: "radio",
            options: ["orange", "fill"],
        },
        variant: {
            control: "radio",
            options: ["primary", "secondary", "outline", "ghost"],
        },
        iconposition: { control: "radio", options: ["left", "right"] },
        fill: { control: "boolean" },
        disabled: { control: "boolean" },
        onclick: { action: { disabled: true } },
        iconPath: { control: "text" },
    },
    args: {
        onclick: fn(),
        label: "Button",
        fill: false,
        disabled: false,
        classname: "",
        iconPath: "/icons/up.svg",
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        label: "Button",
        iconposition: "right",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
        label: "Button",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        label: "Button",
    },
};

export const Ghost: Story = {
    args: {
        variant: "ghost",
        label: "Button",
    },
};

export const FillColor: Story = {
    args: {
        label: "Button",
        color: "fill",
    },
};
