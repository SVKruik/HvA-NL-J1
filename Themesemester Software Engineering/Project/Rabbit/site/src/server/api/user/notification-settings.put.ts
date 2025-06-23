import { formatApiError } from '~/utils/format';
import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';
import { z } from 'zod';

// Validation schema for the request body
const bodySchema = z.object({
    hopperId: z.number(),
    post_comment: z.boolean(),
    post_praise: z.boolean(),
    comment_reply: z.boolean(),
    comment_praise: z.boolean(),
    buddy_accepted: z.boolean(),
    buddy_request: z.boolean(),
    tail_accepted: z.boolean(),
    tail_request: z.boolean(),
    new_achievement: z.boolean(),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { hopperId, post_comment, post_praise, comment_reply, comment_praise, buddy_accepted, buddy_request, tail_accepted, tail_request, new_achievement } = parseResult.data;

        const connection: Pool = await database();

        // Update notification settings
        await connection.query(
            "UPDATE hopper_notification_settings SET post_comment = ?, post_praise = ?, comment_reply = ?, comment_praise = ?, buddy_accepted = ?, buddy_request = ?, tail_accepted = ?, tail_request = ?, new_achievement = ? WHERE hopper_id = ?",
            [post_comment, post_praise, comment_reply, comment_praise, buddy_accepted, buddy_request, tail_accepted, tail_request, new_achievement, hopperId]
        );

        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});
