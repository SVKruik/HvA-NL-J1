import { formatApiError } from '~/utils/format';
import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';

export default defineEventHandler(async (event): Promise<{
    post_comment: boolean;
    post_praise: boolean;
    comment_reply: boolean;
    comment_praise: boolean;
    buddy_accepted: boolean;
    buddy_request: boolean;
    tail_accepted: boolean;
    tail_request: boolean;
    new_achievement: boolean;
}> => {
    try {
        const query = getQuery(event);
        const hopperId = parseInt(query.hopperId as string, 10);
        if (isNaN(hopperId)) throw new Error("Invalid Hopper ID", { cause: { statusCode: 1400 } });
        const connection: Pool = await database();

        // Fetch notification settings
        const response: Array<{
            post_comment: boolean;
            post_praise: boolean;
            comment_reply: boolean;
            comment_praise: boolean;
            buddy_accepted: boolean;
            buddy_request: boolean;
            tail_accepted: boolean;
            tail_request: boolean;
            new_achievement: boolean;
        }> = await connection.query(
            "SELECT post_comment, post_praise, comment_reply, comment_praise, buddy_accepted, buddy_request, tail_accepted, tail_request, new_achievement FROM hopper_notification_settings WHERE hopper_id = ?;",
            [hopperId]
        );
        if (!response.length) throw new Error("Hopper not found", { cause: { statusCode: 1404 } });
        const settings = response[0];

        await connection.end();
        return settings;
    } catch (error: any) {
        throw formatApiError(error);
    }
});