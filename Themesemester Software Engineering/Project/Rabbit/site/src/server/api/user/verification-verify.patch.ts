import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { formatApiError } from '~/utils/format';
import { sendMail } from '~/server/core/gmd/sendMail';

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email(),
    verificationPin: z.number().min(100000).max(999999),
});

/**
 * Verify the user's account to unlock extended functionality.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { email, verificationPin } = parseResult.data;
        const connection: Pool = await database();

        // Check if the code is valid
        const checkResponse: Array<{ "pin": number, "dateVerification": Date | null }> = await connection.query("SELECT pin, date_verification FROM hopper_verification LEFT JOIN hopper ON hopper.email = hopper_email WHERE hopper_email = ? AND reason = 'setup' ORDER BY hopper_verification.date_creation DESC LIMIT 1;", [email]);
        if (checkResponse.length === 0) throw new Error("There is no active verification process for this account. Please try again from the beginning.", { cause: { statusCode: 1400 } });
        if (checkResponse[0].dateVerification) throw new Error("Your account has already been verified. Refresh your browser and log in.", { cause: { statusCode: 1400 } });
        if (checkResponse[0].pin !== verificationPin) throw new Error("The code you entered is incorrect. Please try again.", { cause: { statusCode: 1400 } });

        // Delete the verification code from the database
        // Update the account status
        await connection.query("DELETE FROM hopper_verification WHERE hopper_email = ? AND reason = 'setup'; UPDATE hopper SET date_verification = CURRENT_TIMESTAMP WHERE email = ?;", [email, email]);

        // Dispatch the verification email
        await sendMail(email, "Account Verification Success", [], "verification-success");

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
    } catch (error: any) {
        throw formatApiError(error);
    }
});