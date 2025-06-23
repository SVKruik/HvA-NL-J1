import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { formatApiError } from '~/utils/format';
import { sendMail } from '~/server/core/gmd/sendMail';

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email()
});

/**
 * Verify the user's account to unlock extended functionality.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { email } = parseResult.data;
        const connection: Pool = await database();

        // Start the verification process
        const verificationPin = Math.floor(100000 + Math.random() * 900000);
        await connection.query("DELETE FROM hopper_verification WHERE hopper_email = ? AND reason = 'setup'; INSERT INTO hopper_verification (hopper_email, pin, reason) VALUES (?, ?, ?)", [
            email,
            email,
            verificationPin,
            "setup"
        ]);

        // Dispatch the verification email
        await sendMail(email, "Account Verification Code", [{
            "key": "verificationPin", "value": verificationPin.toString(),
        }], "verification");

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
    } catch (error: any) {
        throw formatApiError(error);
    }
});