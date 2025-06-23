// stories/PostComponent.stories.ts
import type { Meta, StoryObj } from "@storybook/vue3";
import { PostTypes } from "~/assets/customTypes";
import PostComponent from "~/components/PostComponent.vue";

const meta: Meta<typeof PostComponent> = {
    title: "Components/Post",
    component: PostComponent,
    tags: ["autodocs"],
    argTypes: {
        username: { control: "text" },
        avatar: { control: "text" },
        burrow: { control: "text" },
        timeAgo: { control: "text" },
        media: { control: "text" },
        type: { control: "select", options: ["text", "video", "image"] },
        imageAlt: { control: "text" },
        upvotes: { control: "number" },
        comments: { control: "number" },
        member: { control: "boolean" },
        joinHidden: { control: "boolean" },
        burrowHidden: { control: "boolean" },
        loading: { control: "boolean" },
    },
    args: {
        username: "BunnyRabbit123",
        avatar: "/icons/avatar.svg",
        burrow: "b/HowToGetFreeCarrots",
        timeAgo: "1 hour ago",
        media: "/free_carrots.jpg",
        type: PostTypes.image,
        imageAlt: "Free Carrots",
        upvotes: 123,
        comments: 45,
        member: true,
        joinHidden: false,
        burrowHidden: false,
        loading: false,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
    args: {
        media: '/invalid/path/to/image.png',
    }
};

export const NoImage: Story = {
    args: {
        media: undefined,
        imageAlt: "",
        type: PostTypes.text,
    },
};

export const NoJoinButton: Story = {
    args: {
        joinHidden: true,
    },
};

export const NoBurrow: Story = {
    args: {
        burrowHidden: true,
    },
};

export const EmptyPost: Story = {
    args: {
        loading: true,
        username: "",
        avatar: "",
        burrow: "",
        timeAgo: "",
        media: undefined,
        imageAlt: "",
        upvotes: 0,
        comments: 0,
        member: false,
        type: PostTypes.text,
    },
};

export const VideoPost: Story = {
    args: {
        media: "burrow",
        type: PostTypes.video,
        imageAlt: "",
    },
};
