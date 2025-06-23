import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { z } from "zod";
import { sendMail } from "~/server/core/gmd/sendMail";
import { UserStatusTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email(),
});

/**
 * Send a restore email with a 6-digit code to the user's email address.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success)
            throw new Error(
                "The form is not completed correctly. Please try again.",
                { cause: { statusCode: 1400 } },
            );
        const { email } = parseResult.data;
        const connection: Pool = await database();

        // Check if the account exists
        const checkResponse: Array<{ status: keyof typeof UserStatusTypes }> =
            await connection.query(
                "SELECT status FROM hopper WHERE email = ? LIMIT 1;",
                [email],
            );
        if (checkResponse.length === 0)
            throw new Error(
                "This email address is not associated with any account. Please try again.",
                { cause: { statusCode: 1400 } },
            );
        if (checkResponse[0].status !== UserStatusTypes.active)
            throw new Error(
                "Your account is on timeout or banned. Contact support to appeal.",
                { cause: { statusCode: 1403 } },
            );

        // Send the email with a 6-digit code
        const verificationPin: number = Math.floor(100000 + Math.random() * 900000);
        await sendMail(email, "Account Recovery Code", [
            { "key": "verificationPin", "value": verificationPin.toString() },
        ], "restore");

        // Delete any existing verification codes for the same email and reason
        // Insert the verification code into the database
        await connection.query(
            "DELETE FROM hopper_verification WHERE hopper_email = ? AND reason = 'recovery'; INSERT INTO hopper_verification (hopper_email, pin, reason) VALUES (?, ?, ?)",
            [email, email, verificationPin, "recovery"],
        );

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
    } catch (error: any) {
        throw formatApiError(error);
    }
});
