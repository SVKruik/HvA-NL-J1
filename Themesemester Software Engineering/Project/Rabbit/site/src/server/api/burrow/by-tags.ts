import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';

// Validation schema for the request body
const bodySchema = z.object({
    tags: z.array(z.object({
        id: z.number(),
        name: z.string(),
    }))
});

export default defineEventHandler(async (event): Promise<Array<{ "id": number, "name": string, "avatar": string }>> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { tags } = parseResult.data;
        const connection: Pool = await database();

        const matchingBurrows: Array<{ "id": number, "name": string, "avatar": string }> = await connection.query(
            "SELECT DISTINCT b.id, b.name, b.avatar FROM burrow AS b JOIN burrow_tag AS bt ON b.id = bt.burrow_id JOIN tag AS t ON bt.tag_id = t.id WHERE t.id IN (?)",
            [tags.map((tag) => tag.id)]
        );

        await connection.end();
        return matchingBurrows;
    } catch (error: any) {
        throw formatApiError(error);
    }
});