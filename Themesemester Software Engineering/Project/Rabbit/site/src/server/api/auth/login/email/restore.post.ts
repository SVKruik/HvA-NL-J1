import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { sendMail } from '~/server/core/gmd/sendMail';
import { isValidPassword } from '~/utils/validation';
import { UserData, UserStatusTypes } from '~/assets/customTypes';
import { formatApiError } from '~/utils/format';

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email(),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
});

/**
 * Update the password of a user.
 */
export default defineEventHandler(async (event): Promise<UserData> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { email, newPassword, confirmPassword } = parseResult.data;
        const connection: Pool = await database();

        // Validate the form data
        if (newPassword !== confirmPassword) throw new Error("The passwords do not match. Please try again.", { cause: { statusCode: 1400 } });
        if (!isValidPassword(newPassword)) throw new Error("Your password should contain a capital and lowercase letter, a number, a special character and should be atleast 8 characters long.", { cause: { statusCode: 1400 } });

        // Check if the account exists
        const checkResponse: Array<{
            "id": number,
            "email": string,
            "username": string,
            "avatar": string,
            "status": keyof typeof UserStatusTypes
        }> = await connection.query("SELECT id, email, username, avatar, status FROM hopper WHERE email = ? LIMIT 1;", [email]);
        if (checkResponse.length === 0) throw new Error("This email address is not associated with any account. Please try again.", { cause: { statusCode: 1400 } });
        if (checkResponse[0].status !== UserStatusTypes.active) throw new Error("Your account is on timeout or banned. Contact support to appeal.", { cause: { statusCode: 1403 } });

        // Update the password in the database
        const hashedPassword = await hashPassword(newPassword);
        await connection.query("UPDATE hopper SET password = ? WHERE email = ?", [hashedPassword, email]);

        // Send a confirmation email
        await sendMail(email, "Account Recovery Success", [], "restore-success");

        // Create the session
        const session = await createUserSession(event, {
            id: checkResponse[0].id,
            username: checkResponse[0].username,
            email: email,
            type: "Hopper",
            avatar: checkResponse[0].avatar,
            init: false
        }, connection);
        await connection.end();
        return session;
    } catch (error: any) {
        throw formatApiError(error);
    }
});