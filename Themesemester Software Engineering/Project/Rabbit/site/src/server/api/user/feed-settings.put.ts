import { formatApiError } from '~/utils/format';
import { database } from '~/server/utils/database';
import type { Pool } from 'mariadb';
import { z } from 'zod';

// Validation schema for the request body
const bodySchema = z.object({
    hopperId: z.number(),
    can_view_nsfw: z.boolean(),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { hopperId, can_view_nsfw } = parseResult.data;

        const connection: Pool = await database();

        // Update feed settings
        await connection.query(
            "UPDATE hopper SET can_view_nsfw = ? WHERE id = ?",
            [can_view_nsfw, hopperId]
        );

        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});