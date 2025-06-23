import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { sendMail } from "~/server/core/gmd/sendMail";
import { deleteFile } from "~/server/core/cdn/file";
import { FileTypes } from "~/assets/customTypes";

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email()
});

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { email } = parseResult.data;
        const connection: Pool = await database();

        // Delete Burrows
        await connection.query("UPDATE burrow SET date_deleted = NOW() LEFT JOIN hopper ON burrow.hopper_id = hopper.id WHERE hopper.email = ?;", [email]);

        const response = await connection.query("SELECT avatar, banner FROM hopper WHERE email = ?; DELETE FROM hopper WHERE email = ?;", [email]);
        const selectRows = response[0] as Array<{ avatar: string | null; banner: string | null; }>;
        if (selectRows.length === 0) {
            await connection.end();
            throw new Error("No account found with this email address.", { cause: { statusCode: 1404 } });
        }

        // Clear CDN
        if (response[0].avatar) await deleteFile(response[0].avatar + ".webp", FileTypes.hopperAvatar);
        if (response[0].banner) await deleteFile(response[0].banner + ".webp", FileTypes.hopperBanner);

        await sendMail(email, "Account Deleted", [], "account-delete");

        await clearUserSession(event);
        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});