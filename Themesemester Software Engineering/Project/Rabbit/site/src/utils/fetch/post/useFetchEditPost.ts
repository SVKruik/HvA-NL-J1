import type { Burrow } from "~/assets/customTypes";

export const useFetchEditPost = async (post: FormData): Promise<Burrow> => {
    try {
        const data = await $fetch<Burrow>("/api/posts/editPost", {
            method: "PUT",
            body: post,
        });
        return data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.statusMessage || "Failed to create post.", {
            cause: { statusCode: error.statusCode || 500 },
        });
    }
};
