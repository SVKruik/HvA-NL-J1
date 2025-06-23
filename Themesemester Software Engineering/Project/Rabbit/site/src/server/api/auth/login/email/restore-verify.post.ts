import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { formatApiError } from '~/utils/format';

// Validation schema for the request body
const bodySchema = z.object({
    recoveryCode: z.number().min(100000).max(999999),
    email: z.string().email(),
});

/**
 * Verify the 6-digit code sent to the user's email address.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { recoveryCode, email } = parseResult.data;
        const connection: Pool = await database();

        // Check if the code is valid
        const response: Array<{ "pin": number }> = await connection.query("SELECT pin FROM hopper_verification WHERE hopper_email = ? AND reason = 'recovery' LIMIT 1;", [email]);
        if (response.length === 0) throw new Error("There is no active recovery process for this account. Please try again from the beginning.", { cause: { statusCode: 1400 } });
        if (response[0].pin !== recoveryCode) throw new Error("The code you entered is incorrect. Please try again.", { cause: { statusCode: 1400 } });

        // Delete the verification code from the database
        await connection.query("DELETE FROM hopper_verification WHERE hopper_email = ? AND reason = 'recovery';", [email]);

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
    } catch (error: any) {
        throw formatApiError(error);
    }
});