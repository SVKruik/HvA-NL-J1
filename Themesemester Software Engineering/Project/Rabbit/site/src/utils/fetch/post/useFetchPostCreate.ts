/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PostData } from "~/assets/customTypes";

/**
 * @param post - The post data to be created.
 * @returns {Promise<PostData>} - A promise that resolves to the created post data.
 * @throws {Error} - Throws an error if the post creation fails.
 * @description This function sends a POST request to create a new post.
 */
export const useFetchPostCreate = async (post: FormData): Promise<PostData> => {
    try {
        return await $fetch<PostData>("/api/posts/createPost", {
            method: "POST",
            body: post,
        });
    } catch (error: any) {
        throw formatError(error);
    }
};