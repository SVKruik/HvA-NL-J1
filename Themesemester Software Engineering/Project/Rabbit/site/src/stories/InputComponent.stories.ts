import type { Meta, StoryObj } from "@nuxtjs/storybook";
import InputComponent from "~/components/InputComponent.vue";

const meta = {
    title: "Components/InputField",
    component: InputComponent,
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text" },
        required: { control: "boolean" },
        color: { control: "radio", options: ["Ebony Clay", "Bunker"] },
        icon: { control: "boolean" },
        maxLength: { control: "number" },
        smallText: { control: "boolean" },
        size: {
            control: "radio",
            options: ["small", "medium", "large"],
        },
        fill: { control: "boolean" },
        type: { control: "radio", options: ["text", "image & video", "URL"] },
    },
    args: {
        label: "Enter....",
        required: false,
        color: "Ebony Clay",
        icon: false,
        maxLength: 0,
        smallText: false,
        fill: false,
        type: "text",
    },
} satisfies Meta<typeof InputComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const DarkerBackground: Story = {
    args: {
        color: "Bunker",
    },
};

export const OptionalField: Story = {
    args: {
        required: false,
    },
};

export const Fill: Story = {
    args: {
        fill: true,
    },
};

export const ImageUpload: Story = {
    args: {
        type: "image & video",
    },
};

export const VideoUpload: Story = {
    args: {
        type: "URL",
    },
};
