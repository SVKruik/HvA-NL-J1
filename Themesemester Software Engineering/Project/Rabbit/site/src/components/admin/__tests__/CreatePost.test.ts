// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import newPost from "@/components/newPost.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
// Use vi.hoisted to create the mock function, ensuring it's available for the hoisted vi.mock call.
const { postCreateMock } = vi.hoisted(() => {
    return { postCreateMock: vi.fn() };
});

// @ts-expect-error: test mock for Nuxt auto-import
globalThis.useUserStore = () => ({
    user: { id: 1, username: "testuser" },
    isLoggedIn: true,
    isAdmin: true,
});

vi.mock("~/utils/fetch/burrow/useFetchBurrowsAllowed", () => ({
    useFetchBurrowsAllowed: vi
        .fn()
        .mockResolvedValue([
            { id: 1, name: "TestBurrow", is_nsfw_allowed: true, avatar: "" },
        ]),
}));
vi.mock("~/utils/fetch/burrow/useFetchBurrowLabels", () => ({
    useFetchBurrowLabels: vi
        .fn()
        .mockResolvedValue([{ id: 1, name: "General", color: "ffcc00" }]),
}));
vi.mock("~/utils/fetch/post/useFetchPostCreate", () => ({
    useFetchPostCreate: postCreateMock,
}));
vi.stubGlobal("useNuxtApp", () => ({
    $event: vi.fn(),
}));

describe("newPost.vue", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        postCreateMock.mockResolvedValue({});

        window.URL.createObjectURL = vi.fn(() => "mock-url-for-preview");
        window.URL.revokeObjectURL = vi.fn();
    });

    it("creates a text post successfully", async () => {
        render(newPost, {
            props: { open: true },
        });
        const user = userEvent.setup();

        // --- Fill out the form ---
        await user.type(
            await screen.findByPlaceholderText("Select or search burrow"),
            "TestBurrow",
        );
        await user.click(await screen.findByText("TestBurrow"));
        await user.type(await screen.findByLabelText(/title/i), "My Test Post");

        const descriptionWrapper =
            await screen.findByTestId("description-post");
        const contentEditable = descriptionWrapper.querySelector(
            '[contenteditable="true"]',
        );
        if (!contentEditable)
            throw new Error("Contenteditable element not found");
        await user.type(contentEditable, "This is my post description.");

        await user.click(
            await screen.findByRole("button", { name: /add labels/i }),
        );
        await user.click(await screen.findByText("General"));

        await user.click(await screen.findByTestId("post-post"));

        await waitFor(() => {
            expect(postCreateMock).toHaveBeenCalledTimes(1);
        });

        const formData = postCreateMock.mock.calls[0][0] as FormData;
        const payload = JSON.parse(formData.get("createPostPayload") as string);

        expect(payload.type).toBe("text");
        expect(formData.has("mediaFile")).toBe(false);
    });

    it("creates an image post successfully", async () => {
        render(newPost, {
            props: { open: true },
            global: {
                components: {
                    Button: ButtonComponent,
                    Input: InputComponent,
                    Textarea: TextareaComponent,
                },
            },
        });
        const user = userEvent.setup();
        await user.type(
            await screen.findByPlaceholderText("Select or search burrow"),
            "TestBurrow",
        );
        await user.click(await screen.findByText("TestBurrow"));
        await user.type(
            await screen.findByLabelText(/title/i),
            "My Awesome Image Post",
        );
        await user.click(await screen.findByText("image"));

        const file = new File(["test"], "test.png", {
            type: "image/png",
        });
        const fileInput = await screen.findByLabelText<HTMLInputElement>(
            /click to upload image/i,
        );
        await user.upload(fileInput, file);

        await user.click(
            await screen.findByRole("button", { name: /add labels/i }),
        );
        await user.click(await screen.findByText("General"));

        await user.click(await screen.findByTestId("post-post"));

        await waitFor(() => {
            expect(postCreateMock).toHaveBeenCalledTimes(1);
        });

        const formData = postCreateMock.mock.calls[0][0] as FormData;
        const payload = JSON.parse(formData.get("createPostPayload") as string);
        const uploadedFile = formData.get("mediaFile") as File;

        expect(payload.title).toBe("My Awesome Image Post");
        expect(payload.type).toBe("image");
        expect(formData.has("mediaFile")).toBe(true);
        expect(uploadedFile.name).toBe("test.png");
        expect(uploadedFile.type).toBe("image/png");
    });
    it("creates an video post successfully", async () => {
        render(newPost, {
            props: { open: true },
        });
        const user = userEvent.setup();

        await user.type(
            await screen.findByPlaceholderText("Select or search burrow"),
            "TestBurrow",
        );
        await user.click(await screen.findByText("TestBurrow"));
        await user.type(
            await screen.findByLabelText(/title/i),
            "My Awesome video Post",
        );

        await user.click(await screen.findByText("video"));

        const blob = new Uint8Array(10 * 1024 * 1024); // 10MB fake binary data
        const file = new File([blob], "test.mp4", { type: "video/mp4" });
        const fileInput = await screen.findByLabelText<HTMLInputElement>(
            /click to upload video/i,
        );
        await user.upload(fileInput, file);

        await user.click(
            await screen.findByRole("button", { name: /add labels/i }),
        );
        await user.click(await screen.findByText("General"));

        await user.click(await screen.findByTestId("post-post"));

        await waitFor(() => {
            expect(postCreateMock).toHaveBeenCalledTimes(1);
        });

        const formData = postCreateMock.mock.calls[0][0] as FormData;
        const payload = JSON.parse(formData.get("createPostPayload") as string);
        const uploadedFile = formData.get("mediaFile") as File;

        expect(payload.title).toBe("My Awesome video Post");
        expect(payload.type).toBe("video");
        expect(formData.has("mediaFile")).toBe(true);
        expect(uploadedFile.name).toBe("test.mp4");
        expect(uploadedFile.type).toBe("video/mp4");
    });
});
