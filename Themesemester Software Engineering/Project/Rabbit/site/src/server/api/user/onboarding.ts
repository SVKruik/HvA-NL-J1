import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';

// Validation schema for the request body
const bodySchema = z.object({
    hopperId: z.number(),
    nsfwAllowed: z.boolean(),
    joinedBurrows: z.array(z.number()),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { hopperId, nsfwAllowed, joinedBurrows } = parseResult.data;
        const connection: Pool = await database();

        // Update Hopper information
        await connection.query(
            "UPDATE hopper SET can_view_nsfw = ? WHERE id = ?",
            [nsfwAllowed, hopperId]
        );

        // Link the Hopper to the Burrows
        joinedBurrows.forEach(async (burrowId) => {
            await connection.query(
                "INSERT INTO burrow_member (hopper_id, burrow_id) VALUES (?, ?)",
                [hopperId, burrowId]
            );
        });

        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});