import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { sendMail } from "~/server/core/gmd/sendMail";
import { handle2FACD } from "~/server/utils/achievements/handlers";

// Validation schema for the request body
const bodySchema = z.object({
    status: z.boolean(),
    email: z.string().email(),
    hopperId: z.number(),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { status, email, hopperId } = parseResult.data;
        const connection: Pool = await database();

        // Update Hopper status
        await connection.query("UPDATE hopper SET date_2fa = ? WHERE id = ?", [
            status ? new Date() : null,
            hopperId
        ]);

        if (status) await sendMail(email, "2FA Setup Complete", [], "2fa-setup");
        await handle2FACD(status ? "add" : "delete", hopperId, connection);
        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});