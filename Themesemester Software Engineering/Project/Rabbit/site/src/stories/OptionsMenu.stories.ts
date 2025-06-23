import type { Meta, StoryObj } from "@nuxtjs/storybook";
import OptionsMenu from "~/components/OptionsMenu.vue";

const meta: Meta<typeof OptionsMenu> = {
    title: "Components/OptionsMenu",
    component: OptionsMenu,
    tags: ["autodocs"],
    argTypes: {
        options: {
            control: "object",
        },
    },
    args: {
        options: [
            { label: "Edit", icon: "fi fi-ss-pencil", value: "edit" },
            { label: "Report", icon: "fi fi-ss-flag", value: "report" },
            { label: "Delete", icon: "fi fi-ss-trash", value: "delete", style: "color: red;" },
        ],
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomStyles: Story = {
    args: {
        options: [
            { label: "Pin", icon: "fi fi-ss-thumbtack", value: "pin", style: "color: green;" },
            { label: "Share", icon: "fi fi-ss-share", value: "share" },
            { label: "Block", icon: "fi fi-ss-ban", value: "block", style: "color: orange;" },
        ],
    },
};

export const WithoutIcons: Story = {
    args: {
        options: [
            { label: "Option 1", value: "opt1" },
            { label: "Option 2", value: "opt2" },
        ],
    },
};