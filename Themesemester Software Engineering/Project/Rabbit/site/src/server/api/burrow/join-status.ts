import { database } from "~/server/utils/database";
import { formatApiError } from "~/utils/format";
import { z } from "zod";

const bodySchema = z.object({
    burrow_id: z.number().positive(),
    hopper_id: z.number().positive(),
    join: z.boolean(),
});
/**
 * API handler to join or leave a burrow.
 * Expects JSON body: { burrow_id: number, join: boolean, hopper_id: number }
 * If join is true, adds to burrow_member. If false, removes from burrow_member.
 */
export default defineEventHandler(async (event) => {
    try {
        const body = bodySchema.safeParse(await readBody(event));
        if (!body.success)
            throw new Error(
                "The form is not completed correctly. Please try again.",
                { cause: { statusCode: 1400 } },
            );

        const { burrow_id, join, hopper_id } = body.data;

        if (!burrow_id || typeof join !== "boolean" || !hopper_id) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    "Missing required fields: burrow_id, join, hopper_id",
            });
        }

        const connection = await database();

        if (join) {
            await connection.query(
                `INSERT INTO burrow_member (burrow_id, hopper_id) VALUES (?, ?)`,
                [burrow_id, hopper_id],
            );
        } else {
            await connection.query(
                `DELETE FROM burrow_member WHERE burrow_id = ? AND hopper_id = ?`,
                [burrow_id, hopper_id],
            );
        }

        await connection.end();

        return { success: true, joined: join };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
