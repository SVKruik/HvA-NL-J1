import type { Pool } from "mariadb";
import { database } from "../../utils/database";
import { FileTypes, type newBurrow } from "~/assets/customTypes";
import { uploadFile } from "~/server/core/cdn/file";
import { formatApiError } from "~/utils/format";
import { Burrow } from "~/server/core/ges/burrow";

/**
 * Creates a new post in the database.
 *
 * @returns {object} Result or error
 */
export default defineEventHandler(async (event) => {
    let connection: Pool | null = null;

    try {
        const formData: FormData = await readFormData(event);
        if (!formData) {
            throw new Error("no form data provided", {
                cause: { statusCode: 1400 },
            });
        }

        const rawCreateBurrowPayload: string | null = formData.get(
            "createBurrowPayload",
        ) as string | null;
        if (!rawCreateBurrowPayload) {
            throw new Error(
                "Please complete all required fields and try again.",
                { cause: { statusCode: 1400 } },
            );
        }

        const createBurrowPayload: newBurrow = JSON.parse(
            rawCreateBurrowPayload,
        );
        const {
            hopper_id,
            name,
            tags,
            description,
            avatar,
            banner,
            isNsfwAllowed,
            labels,
        } = createBurrowPayload;
        if (
            !hopper_id ||
            !name ||
            !description ||
            !tags ||
            !avatar ||
            !banner ||
            !labels ||
            isNsfwAllowed === undefined
        ) {
            throw new Error(
                "Please complete all required fields and try again.",
                { cause: { statusCode: 1400 } },
            );
        }

        const avatarFile: File | null = formData.get(
            "avatarFile",
        ) as File | null;
        const bannerFile: File | null = formData.get(
            "bannerFile",
        ) as File | null;
        if (!avatarFile) {
            throw new Error("Avatar file is required or wrong type.", {
                cause: { statusCode: 1400 },
            });
        }
        if (!bannerFile) {
            throw new Error("Banner file is required or wrong type.", {
                cause: { statusCode: 1400 },
            });
        }
        if (avatarFile && avatar && bannerFile && banner) {
            // Upload the avatar and banner files to the SFTP server
            await uploadFile(avatar, FileTypes.burrowAvatar, avatarFile);
            await uploadFile(banner, FileTypes.burrowBanner, bannerFile);
        }
        connection = await database();
        const checkVerificationQuery = `
            SELECT date_verification FROM hopper WHERE id = ? LIMIT 1            `;
        const isAllowedToPost = await connection.query(checkVerificationQuery, [
            hopper_id,
        ]);
        if (isAllowedToPost[0].date_verification === null) {
            throw new Error(
                "You are not allowed to post, you need to verify your account.",
                { cause: { statusCode: 1400 } },
            );
        }
        const checkNameQuery = `
        SELECT name FROM burrow WHERE name = ?
        `;
        const isNameTaken = await connection.query(checkNameQuery, [name]);
        if (isNameTaken.length) {
            throw new Error(
                "Name of burrow is already taken, name a unique one",
                { cause: { statusCode: 1400 } },
            );
        }
        const query = `
            INSERT INTO burrow (hopper_id, name, description, avatar, banner, is_nsfw_allowed)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [
            hopper_id,
            name,
            description,
            avatar,
            banner,
            isNsfwAllowed,
        ];
        const result = await connection.query(query, values);
        const burrow_id = result.insertId;

        const insertTagsQuery = `
            INSERT INTO burrow_tag (burrow_id, tag_id)
            VALUES (?, ?)
        `;
        const insertLabelsQuery = `
            INSERT INTO burrow_label (burrow_id, name, color)
            VALUES (?, ?, ?)
        `;
        const insertBurrowTagsValues = tags.map((tag) => [burrow_id, tag.id]);
        const insertBurrowLabelsValues = labels.map((label) => [
            burrow_id,
            label.name,
            label.color,
        ]);

        const burrowMemberQuery = `
            INSERT INTO burrow_member (burrow_id, hopper_id) VALUES (?, ?)
        `;
        const insertMemberResult = await connection.query(burrowMemberQuery, [
            burrow_id,
            hopper_id,
        ]);
        const insertKeeperQuery = `
            INSERT INTO burrow_keeper (burrow_id, hopper_id) VALUES (?, ?)
            `;
        const insertKeeperResult = await connection.query(insertKeeperQuery, [
            burrow_id,
            hopper_id,
        ]);
        // confert to string, otherwise error when returning the label and tags
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function convertBigIntToString(obj: any): any {
            if (Array.isArray(obj)) {
                return obj.map(convertBigIntToString);
            } else if (obj && typeof obj === "object") {
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
        const tagsResult = await Promise.all(
            insertBurrowTagsValues.map((values) =>
                connection!.query(insertTagsQuery, values),
            ),
        );
        const labelResult = await Promise.all(
            insertBurrowLabelsValues.map((values) =>
                connection!.query(insertLabelsQuery, values),
            ),
        );
        const burrow = new Burrow(
            result.insertId,
            hopper_id,
            hopper_id,
            undefined,
            connection,
        );
        await burrow.create();
        return {
            success: true,
            postId: result.insertId ? result.insertId.toString() : undefined,
            tagsResult: convertBigIntToString(tagsResult),
            labelResult: convertBigIntToString(labelResult),
            insertMemberResult: convertBigIntToString(insertMemberResult),
            insertKeeperResult: convertBigIntToString(insertKeeperResult),
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
