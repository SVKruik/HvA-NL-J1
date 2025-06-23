import type { Pool } from "mariadb";
import { database } from "../../utils/database";
import { FileTypes, type PostData } from "~/assets/customTypes";
import { deleteFile, uploadFile } from "~/server/core/cdn/file";
import { formatApiError } from "~/utils/format";

/**
 * API handler to edit an existing post.
 *
 * Handles form submission with optional media upload and payload JSON string.
 * Verifies account status and post ownership before updating post fields.
 * Supports updating media, title, type, and post flags like NSFW or spoiler.
 *
 * @param event - Incoming API event with multipart form data.
 * @returns A success message with the updated post ID.
 * @throws Returns a formatted API error if validation or authorization fails.
 */
export default defineEventHandler(async (event) => {
    let connection: Pool | null = null;

    try {
        const formData: FormData = await readFormData(event);
        if (!formData)
            throw new Error("No form data provided.", {
                cause: { statusCode: 1400 },
            });

        const file = formData.get("mediaFile") as File | null;
        const rawPayload = formData.get("editPostPayload") as string | null;
        if (!rawPayload) {
            throw new Error("No edit post payload provided.", {
                cause: { statusCode: 1400 },
            });
        }
        const payload: Partial<PostData> & { post_id: number } =
            JSON.parse(rawPayload);

        const {
            post_id,
            hopper_id,
            burrow_id,
            burrow_label_id,
            title,
            type,
            description,
            is_nsfw,
            is_spoiler,
            is_concept,
            can_praise,
            can_comment,
            media,
        } = payload;

        if (!post_id || !hopper_id || !burrow_id)
            throw new Error("Missing required fields.", {
                cause: { statusCode: 1400 },
            });

        connection = await database();

        // Account verification check
        const [{ date_verification }] = await connection.query(
            `SELECT date_verification FROM hopper WHERE id = ? LIMIT 1`,
            [hopper_id],
        );
        if (!date_verification)
            throw new Error("Account not verified.", {
                cause: { statusCode: 1400 },
            });

        // Ownership check
        const [existing] = await connection.query(
            `SELECT hopper_id FROM post WHERE id = ? LIMIT 1`,
            [post_id],
        );
        if (!existing || existing.hopper_id !== hopper_id)
            throw new Error("Not authorized to edit this post.", {
                cause: { statusCode: 1403 },
            });

        const updateFields: string[] = [];
        const updateValues: unknown[] = [];
        const [currentPost] = await connection.query(
            `SELECT media, type FROM post WHERE id = ? LIMIT 1`,
            [post_id],
        );
        const oldMedia = currentPost?.media;
        const oldType = currentPost?.type;

        if (file && media) {
            // If there was old media, delete it
            if (oldMedia) {
                if (oldType === "image") {
                    await deleteFile(oldMedia + ".webp", FileTypes.postImage);
                }
                if (oldType === "video") {
                    await deleteFile(oldMedia + ".mp4", FileTypes.postVideo);
                }
            }
            // Upload new file (will overwrite if same name)
            if (type === "video") {
                await uploadFile(media, FileTypes.postVideo, file);
            }
            if (type === "image") {
                await uploadFile(media, FileTypes.postImage, file);
            }
            updateFields.push("media = ?");
            updateValues.push(media);
        }
        if (title !== undefined) {
            updateFields.push("title = ?");
            updateValues.push(title);
        }
        if (description !== undefined) {
            updateFields.push("description = ?");
            updateValues.push(description);
        }
        if (type !== undefined) {
            updateFields.push("type = ?");
            updateValues.push(type);
        }
        if (typeof is_nsfw !== "undefined") {
            updateFields.push("is_nsfw = ?");
            updateValues.push(is_nsfw);
        }
        if (typeof is_spoiler !== "undefined") {
            updateFields.push("is_spoiler = ?");
            updateValues.push(is_spoiler);
        }
        if (typeof is_concept !== "undefined") {
            updateFields.push("is_concept = ?");
            updateValues.push(is_concept);
        }
        if (typeof can_praise !== "undefined") {
            updateFields.push("can_praise = ?");
            updateValues.push(can_praise);
        }
        if (typeof can_comment !== "undefined") {
            updateFields.push("can_comment = ?");
            updateValues.push(can_comment);
        }
        if (burrow_label_id !== undefined) {
            updateFields.push("burrow_label_id = ?");
            updateValues.push(burrow_label_id);
        }

        if (updateFields.length > 0) {
            updateFields.push("date_modified = ?");
            updateValues.push(new Date());

            const query = `
        UPDATE post SET ${updateFields.join(", ")}
        WHERE id = ? AND hopper_id = ?
    `;
            updateValues.push(post_id, hopper_id);
            await connection.query(query, updateValues);
        }

        return {
            success: true,
            message: "Post updated successfully.",
            postId: post_id.toString(),
        };
    } catch (error: unknown) {
        throw formatApiError(error);
    } finally {
        if (connection) await connection.end();
    }
});
