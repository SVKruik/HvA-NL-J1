import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { CronJobTypes, UserData, UserStatusTypes } from '~/assets/customTypes';
import { createUserSession } from '~/server/utils/session';
import { formatApiError } from '~/utils/format';
import { sendMail } from '~/server/core/gmd/sendMail';

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

/**
 * Login using email and password
 * See /auth.d.ts for the session type
 */
export default defineEventHandler(async (event): Promise<UserData | true> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { email, password } = parseResult.data;

        // Retrieve the user from the database
        const connection: Pool = await database();
        const response: Array<{
            "id": number,
            "username": string,
            "password": string,
            "avatar": string,
            "status": keyof typeof UserStatusTypes,
            "is_banned": number,
            "is_admin": number | null
            "date_2fa": string | null
        }> = await connection.query("SELECT hopper.id AS id, username, password, avatar, status, is_banned, admin.id AS is_admin, date_2fa FROM hopper LEFT JOIN admin on admin.hopper_id = hopper.id WHERE email = ? OR secondary_email = ?", [email, email]);

        // Validate the response
        if (response.length === 0) throw new Error("Email or password is incorrect. Please check your credentials and try again.", { cause: { statusCode: 1401 } });
        const hopper = response[0];

        if (!(await verifyPassword(hopper.password, password))) throw new Error("Email or password is incorrect. Please check your credentials and try again.", { cause: { statusCode: 1401 } });
        if (hopper.status === UserStatusTypes.banned || hopper.is_banned) throw new Error("This account is banned.", { cause: { statusCode: 1401 } });
        if (hopper.status === UserStatusTypes.timeout) {
            // Retrieve the reason for the timeout
            const defaultMessage: string = "Your account is temporarily on timeout. Please try again later.";
            const rawReason: Array<{ "data": any }> = await connection.query("SELECT data FROM scheduled_task WHERE type = ? AND data LIKE ?", [CronJobTypes.userTimeout, `%${hopper.id}%`]);
            if (rawReason.length === 0) throw new Error(defaultMessage, { cause: { statusCode: 1401 } });

            // Parse the reason from the scheduled task
            const reason: string = rawReason[0].data.reason;
            if (!reason) throw new Error(defaultMessage, { cause: { statusCode: 1401 } });

            throw new Error(`Your account is temporarily on timeout. Reason: ${reason}`, { cause: { statusCode: 1401 } });
        }
        if (hopper.date_2fa) {
            // Send the email with a 6-digit code
            const verificationPin: number = Math.floor(100000 + Math.random() * 900000);
            await sendMail(email, "Login 2FA Code", [
                { "key": "verificationPin", "value": verificationPin.toString() },
            ], "2fa-code");

            // Delete any existing verification codes for the same email and reason
            // Insert the verification code into the database
            await connection.query(
                "DELETE FROM hopper_verification WHERE hopper_email = ? AND reason = '2fa'; INSERT INTO hopper_verification (hopper_email, pin, reason) VALUES (?, ?, ?)",
                [email, email, verificationPin, "2fa"],
            );
            await connection.end();
            return true;
        }

        // Create the session
        const session = await createUserSession(event, {
            id: hopper.id,
            username: hopper.username,
            email: email,
            type: hopper.is_admin ? 'Admin' : 'Hopper',
            avatar: hopper.avatar,
            init: false,
        }, connection);
        await connection.end();
        return session;
    } catch (error: any) {
        throw formatApiError(error);
    }
});