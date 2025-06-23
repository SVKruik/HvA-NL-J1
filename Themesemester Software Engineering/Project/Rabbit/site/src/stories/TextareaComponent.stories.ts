import type { Meta, StoryObj } from "@nuxtjs/storybook";
import TextareaComponent from "~/components/TextareaComponent.vue";

const meta = {
    title: "Components/TextareaField",
    component: TextareaComponent,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text" },
        required: { control: "boolean" },
        color: { control: "radio", options: ["Ebony Clay", "Bunker"] },
        maxLength: { control: "number" },
        smallText: { control: "boolean" },
        size: {
            control: "radio",
            options: ["small", "medium", "large"],
        },
        fill: { control: "boolean" },
        type: { control: "radio", options: ["text", "image", "video"] },
        richText: { control: "boolean" },
    },
    args: {
        label: "Enter text...",
        required: false,
        color: "Ebony Clay",
        maxLength: 0,
        smallText: false,
        fill: false,
        size: "medium",
        type: "text",
        richText: false,
    },
} satisfies Meta<typeof TextareaComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithMaxLength: Story = {
    args: {
        maxLength: 500,
    },
};

export const SmallSize: Story = {
    args: {
        size: "small",
    },
};

export const LargeSize: Story = {
    args: {
        size: "large",
    },
};

export const Filled: Story = {
    args: {
        fill: true,
    },
};

export const ImageUpload: Story = {
    args: {
        type: "image",
    },
};

export const RequiredField: Story = {
    args: {
        required: true,
    },
};
export const RichText: Story = {
    args: {
        richText: true,
        type: "text",
    },
};
