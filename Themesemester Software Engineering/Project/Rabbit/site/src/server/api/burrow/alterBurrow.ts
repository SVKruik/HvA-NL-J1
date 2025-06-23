import type { Pool } from "mariadb";
import { database } from "../../utils/database";
import { FileTypes, type BurrowApi } from "~/assets/customTypes";
import { uploadFile } from "~/server/core/cdn/file";
import { formatApiError } from "~/utils/format";

/**
 * Alters an existing burrow with new data if provided.
 *
 * @returns {object} Result or error
 */
export default defineEventHandler(async (event) => {
    let connection: Pool | null = null;

    try {
        const formData: FormData = await readFormData(event);
        if (!formData) {
            throw new Error("No form data provided.", {
                cause: { statusCode: 1400 },
            });
        }

        const rawPayload: string | null = formData.get("alterBurrowPayload") as
            | string
            | null;
        if (!rawPayload) {
            throw new Error("Payload missing or invalid.", {
                cause: { statusCode: 1400 },
            });
        }

        const payload: Partial<BurrowApi> = JSON.parse(rawPayload);
        const {
            burrow_id,
            hopper_id,
            name,
            description,
            isNsfwAllowed,
            tags,
            labels,
            avatar,
            banner,
            rules,
        } = payload;

        if (!burrow_id || !hopper_id) {
            throw new Error("Missing burrow ID or hopper ID.", {
                cause: { statusCode: 1400 },
            });
        }

        const avatarFile: File | null = formData.get(
            "avatarFile",
        ) as File | null;
        const bannerFile: File | null = formData.get(
            "bannerFile",
        ) as File | null;

        connection = await database();

        const checkVerificationQuery = `
            SELECT date_verification FROM hopper WHERE id = ? LIMIT 1
        `;
        const isAllowedToPost = await connection.query(checkVerificationQuery, [
            hopper_id,
        ]);
        if (!isAllowedToPost[0]?.date_verification) {
            throw new Error(
                "You must verify your account before editing a burrow.",
                {
                    cause: { statusCode: 1400 },
                },
            );
        }

        const updateFields: string[] = [];
        const updateValues: unknown[] = [];

        if (name != "") {
            updateFields.push("name = ?");
            updateValues.push(name);
        }
        if (description != "") {
            updateFields.push("description = ?");
            updateValues.push(description);
        }
        updateFields.push("is_nsfw_allowed = ?");
        updateValues.push(isNsfwAllowed);

        if (avatar != "") {
            updateFields.push("avatar = ?");
            updateValues.push(avatar);
        }
        if (banner != "") {
            updateFields.push("banner = ?");
            updateValues.push(banner);
        }

        if (avatarFile && avatar) {
            await uploadFile(avatar, FileTypes.burrowAvatar, avatarFile);
        }

        if (bannerFile && banner) {
            await uploadFile(banner, FileTypes.burrowBanner, bannerFile);
        }

        if (Array.isArray(rules)) {
            updateFields.push("rules = ?");
            updateValues.push(JSON.stringify(rules));
        }

        if (updateFields.length > 0) {
            const updateQuery = `
                UPDATE burrow
                SET ${updateFields.join(", ")}
                WHERE id = ? AND hopper_id = ?
            `;
            updateValues.push(burrow_id, hopper_id);
            await connection.query(updateQuery, updateValues);
        }

        let tagsResult = null;
        if (Array.isArray(tags) && tags.length > 0) {
            await connection.query(
                `DELETE FROM burrow_tag WHERE burrow_id = ?`,
                [burrow_id],
            );
            const insertTagQuery = `INSERT INTO burrow_tag (burrow_id, tag_id) VALUES (?, ?)`;
            const tagValues = tags.map((tag) => [burrow_id, tag.id]);
            tagsResult = await Promise.all(
                tagValues.map((v) => connection!.query(insertTagQuery, v)),
            );
        }

        let labelResult = null;
        if (Array.isArray(labels) && labels.length > 0) {
            await connection.query(
                `DELETE FROM burrow_label WHERE burrow_id = ?`,
                [burrow_id],
            );
            const insertLabelQuery = `INSERT INTO burrow_label (burrow_id, name, color) VALUES (?, ?, ?)`;
            const labelValues = labels.map((label) => [
                burrow_id,
                label.name,
                label.color,
            ]);
            labelResult = await Promise.all(
                labelValues.map((v) => connection!.query(insertLabelQuery, v)),
            );
        }

        // Helper to convert BigInt to string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function convertBigIntToString(obj: any): any {
            if (Array.isArray(obj)) return obj.map(convertBigIntToString);
            if (obj && typeof obj === "object") {
                return Object.fromEntries(
                    Object.entries(obj).map(([k, v]) => [
                        k,
                        typeof v === "bigint"
                            ? v.toString()
                            : convertBigIntToString(v),
                    ]),
                );
            }
            return obj;
        }

        return {
            success: true,
            updatedBurrowId: burrow_id.toString(),
            tagsResult: convertBigIntToString(tagsResult),
            labelResult: convertBigIntToString(labelResult),
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});
