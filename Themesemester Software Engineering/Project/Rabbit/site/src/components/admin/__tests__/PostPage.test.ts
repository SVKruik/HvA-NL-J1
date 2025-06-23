import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/vue";
import { ref } from "vue";
import PostPage from "~/pages/burrow/[name]/post/[id].vue";

// Mock Nuxt composables that are auto-imported in the app to avoid ReferenceErrors during tests
vi.stubGlobal("useNuxtApp", () => ({ $event: vi.fn() }));
vi.stubGlobal("useRoute", () => ({ params: { name: "CafeBurrow", id: "42" } }));
vi.stubGlobal("useUserStore", () => ({ user: { id: 1, username: "Donovantje" } }));
vi.stubGlobal("createTicket", () => "mock-ticket-id");
vi.stubGlobal("navigateTo", vi.fn());

// Mock child components so we can test PostPage in isolation without rendering full subcomponents
vi.mock("~/components/PostComponent.vue", () => ({
    default: {
        name: "PostComponent",
        props: ["singleView"],
        template: "<div data-testid='post'>PostComponent</div>",
    },
}));
vi.mock("~/components/CommentComponent.vue", () => ({
    default: {
        name: "CommentComponent",
        props: ["comment"],
        template: "<div data-testid='comment'>{{ comment.content }}</div>",
    },
}));
vi.mock("~/components/admin/components/Callout.vue", () => ({
    default: {
        name: "Callout",
        props: ["title", "description"],
        template: "<div><h1>{{ title }}</h1><p>{{ description }}</p></div>",
    },
}));
vi.mock("~/components/BurrowSidebar.vue", () => ({
    default: {
        name: "BurrowSidebar",
        props: ["burrow"],
        template: "<div data-testid='sidebar'>BurrowSidebar</div>",
    },
}));
vi.mock("~/components/LoaderComponent.vue", () => ({
    default: {
        name: "LoaderComponent",
        template: "<div data-testid='loader'>Loading...</div>",
    },
}));

// Mock all composables that fetch data in this page
vi.mock("~/utils/fetch/post/useFetchPost");
vi.mock("~/utils/fetch/comments/useFetchCommentsByPost");
vi.mock("~/utils/fetch/burrow/useFetchBurrow");
vi.mock("~/utils/fetch/comments/useFetchCommentCreate");

// Import the mocked composables after they've been mocked
import { useFetchPost } from "~/utils/fetch/post/useFetchPost";
import { useFetchCommentsByPost } from "~/utils/fetch/comments/useFetchCommentsByPost";
import { useFetchBurrow } from "~/utils/fetch/burrow/useFetchBurrow";
import { useFetchCommentCreate } from "~/utils/fetch/comments/useFetchCommentCreate";

// Mock Data Setup

const mockPost = {
    id: 42,
    title: "Test Post",
    comments: 3,
    content: "This is a test post.",
    burrow: "b/CafeBurrow",
};

// Mock comments with different upvote counts to test sorting functionality
const mockComments = [
    { id: 3, commentId: null, content: "Newest comment", username: "Bunny", upvotes: 5 },
    { id: 2, commentId: null, content: "Oldest comment", username: "Hopper", upvotes: 10 },
    { id: 1, commentId: null, content: "Top comment", username: "Rabbit", upvotes: 20 },
];

const mockBurrow = { id: 5, name: "CafeBurrow" };

// Post Page tests

describe("PostPage", () => {
    let mockFetchPost: Mock,
        mockFetchComments: Mock,
        mockFetchBurrow: Mock,
        mockCreateComment: Mock;
    const mockNuxtApp = { $event: vi.fn() };

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();
        (vi.stubGlobal as any)("useNuxtApp", () => mockNuxtApp);

        // Set up fresh mock functions for each test
        mockFetchPost = vi.fn();
        mockFetchComments = vi.fn();
        mockFetchBurrow = vi.fn();
        mockCreateComment = vi.fn().mockResolvedValue({ id: 4, content: "New comment" });

        // Configure mock return values for the composables
        (useFetchPost as Mock).mockReturnValue({
            post: ref(mockPost),
            fetchPost: mockFetchPost,
        });
        (useFetchCommentsByPost as Mock).mockReturnValue({
            comments: ref(mockComments),
            fetchComments: mockFetchComments,
        });
        (useFetchBurrow as Mock).mockReturnValue({
            burrow: ref(mockBurrow),
            fetchBurrow: mockFetchBurrow,
        });
        (useFetchCommentCreate as Mock).mockReturnValue({
            createComment: mockCreateComment,
        });
    });

    describe("Initial Rendering and Data Fetching", () => {
        it("should render main UI elements if data is loaded", async () => {
            // Test that all major components render when data is available
            await render(PostPage);

            expect(await screen.findByTestId("post")).toBeInTheDocument();
            expect(screen.getByTestId("sidebar")).toBeInTheDocument();
            expect(screen.getByText("Newest comment")).toBeInTheDocument();
            expect(screen.getByText("Oldest comment")).toBeInTheDocument();
        });

        it("should trigger all data fetch functions on mount", async () => {
            // Verify that all necessary data fetching happens when component mounts
            await render(PostPage);

            // Wait for composables to be called once
            await waitFor(() => {
                expect(mockFetchBurrow).toHaveBeenCalledTimes(1);
                expect(mockFetchPost).toHaveBeenCalledTimes(1);
                expect(mockFetchComments).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Loading and Error States", () => {
        it("should show the loader while the post is still loading", async () => {
            // Test loading state by simulating null post data
            (useFetchPost as Mock).mockReturnValue({ post: ref(null), fetchPost: mockFetchPost });
            await render(PostPage);

            expect(screen.getByTestId("loader")).toBeInTheDocument();
        });

        it("should show a 'Not Found' message when no post data is available", async () => {
            // Test error state when post data fails to load
            (useFetchPost as Mock).mockReturnValue({ post: ref(null), fetchPost: mockFetchPost });
            await render(PostPage);

            expect(await screen.findByText("Post Not Found")).toBeInTheDocument();
        });
    });

    describe("User Interactions with Comments", () => {
        it("should allow logged-in users to submit a comment and refresh data", async () => {
            // Test the complete comment submission flow
            await render(PostPage);
            const commentInput = screen.getByPlaceholderText("Write a comment...");
            const submitButton = screen.getByRole("button", { name: /post comment/i });

            const newCommentText = "This is a fantastic new comment!";
            // Simulate user typing in the comment input
            await fireEvent.update(commentInput, newCommentText);
            // Simulate clicking the submit button
            await fireEvent.click(submitButton);

            // Verify the comment creation was called with correct parameters
            await waitFor(() => {
                expect(mockCreateComment).toHaveBeenCalledWith({
                    postId: 42,
                    content: newCommentText,
                });
            });

            // Verify that data is refreshed after posting a comment
            await waitFor(() => {
                expect(mockFetchComments).toHaveBeenCalledTimes(2);
                expect(mockFetchPost).toHaveBeenCalledTimes(2);
            });
        });

        it("should block comment form for non-logged-in users", async () => {
            // Test that non-authenticated users cannot access comment functionality
            (vi.stubGlobal as any)("useUserStore", () => ({ user: { id: null } }));
            await render(PostPage);

            expect(screen.getByText("You must be logged in to comment on posts.")).toBeInTheDocument();
            expect(screen.queryByPlaceholderText("Write a comment...")).not.toBeInTheDocument();
        });

        it("should filter visible comments when typing in the search input", async () => {
            // Test comment search/filter functionality
            await render(PostPage);
            await screen.findByText("Newest comment");

            const searchInput = screen.getByPlaceholderText("Search comments...");
            // Search for "oldest" to filter comments
            await fireEvent.update(searchInput, "oldest");

            // Verify only matching comments are visible
            await waitFor(() => {
                expect(screen.getByText("Oldest comment")).toBeInTheDocument();
                expect(screen.queryByText("Newest comment")).not.toBeInTheDocument();
                expect(screen.queryByText("Top comment")).not.toBeInTheDocument();
            });
        });

        it("should sort comments correctly when sort option is changed", async () => {
            // Test comment sorting functionality
            await render(PostPage);
            const sortButton = screen.getByRole("button", { name: /newest/i });

            // Initially sorted by newest - verify initial order
            let comments = screen.getAllByTestId("comment");
            expect(comments[0]).toHaveTextContent("Newest comment");

            // Switch to "Most Praised" sorting option
            await fireEvent.click(sortButton);
            await fireEvent.click(screen.getByText("Most Praised"));

            // Verify comments are now sorted by upvotes (highest first)
            await waitFor(() => {
                comments = screen.getAllByTestId("comment");
                expect(comments[0]).toHaveTextContent("Top comment");
            });
        });
    });

    describe("Edge Cases", () => {
        it("should show a message when there are no comments", async () => {
            // Test empty state when no comments exist
            (useFetchCommentsByPost as Mock).mockReturnValue({
                comments: ref([]),
                fetchComments: mockFetchComments,
            });
            await render(PostPage);

            expect(screen.getByText("This post has no comments yet.")).toBeInTheDocument();
        });
    });
});
