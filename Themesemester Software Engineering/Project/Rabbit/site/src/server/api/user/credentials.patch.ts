import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { isValidEmail, isValidPassword } from "~/utils/validation";
import { sendMail } from "~/server/core/gmd/sendMail";

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().nullable(),
    confirmPassword: z.string().nullable(),
    hopperId: z.number(),
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { email, password, confirmPassword, hopperId } = parseResult.data;
        const connection: Pool = await database();

        if (!isValidEmail(email)) throw new Error("Invalid email address. Please try again.", { cause: { statusCode: 1400 } });

        // Check if passwords match
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match. Please try again.", { cause: { statusCode: 1400 } });
        } else if (password && !isValidPassword(password)) throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.", { cause: { statusCode: 1400 } });

        // Update Hopper credentials
        const hashedPassword = password ? await hashPassword(password) : null;
        if (hashedPassword) {
            await connection.query("UPDATE hopper SET email = ?, password = ? WHERE id = ?", [
                email,
                hashedPassword,
                hopperId,
            ]);
        } else await connection.query("UPDATE hopper SET email = ? WHERE id = ?", [
            email,
            hopperId,
        ]);

        await sendMail(email, "Login Credentials Updated", [], "credentials-change");
        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});