import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { formatApiError } from '~/utils/format';

// Validation schema for the request body
const bodySchema = z.object({
    hopperId: z.number().int().positive(),
    notificationTicket: z.string().min(1),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { hopperId, notificationTicket } = parseResult.data;
        const connection: Pool = await database();

        await connection.query("DELETE FROM hopper_notification WHERE hopper_id = ? AND ticket = ?;", [hopperId, notificationTicket]);

        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});