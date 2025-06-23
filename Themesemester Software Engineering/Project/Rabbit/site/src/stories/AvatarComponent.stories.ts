import type { Meta, StoryObj } from "@nuxtjs/storybook";

import Avatar from "../components/AvatarComponent.vue";

const meta = {
    title: "Components/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    argTypes: {
        url: { control: "text" },
        classname: { control: "text" },
        size: { control: "radio", options: ["large"] },
    },
    args: {
        size: "large",
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithoutImage: Story = {
    args: {
        size: "large",
    },
};

export const WithImage: Story = {
    args: {
        size: "large",
        url: "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg",
    },
};
