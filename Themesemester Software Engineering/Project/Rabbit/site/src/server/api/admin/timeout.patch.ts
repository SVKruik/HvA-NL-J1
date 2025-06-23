import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { registerCron } from '~/server/core/tss/registerCron';
import { formatApiError } from '~/utils/format';

// Validation schema for the request body
const bodySchema = z.object({
    hopperId: z.number().min(1),
    timeoutHours: z.number().min(1),
    reason: z.string().optional(),
});

/**
 * Verify the user's account to unlock extended functionality.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { hopperId, timeoutHours, reason } = parseResult.data;
        const connection: Pool = await database();

        // Update Hopper status
        await connection.query("UPDATE hopper SET status = 'timeout' WHERE id = ?", [hopperId]);
        await registerCron({
            "type": "userTimeout",
            "data": { "hopperId": hopperId, "reason": reason },
            "date_schedule": new Date(Date.now() + timeoutHours * 60 * 60 * 1000),
        }, connection);

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
    } catch (error: any) {
        throw formatApiError(error);
    }
});