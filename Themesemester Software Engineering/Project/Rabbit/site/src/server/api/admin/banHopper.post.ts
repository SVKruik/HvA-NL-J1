import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { sendMail } from "~/server/core/gmd/sendMail";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<string> => {
    try {
        const body = await readBody(event);
        const [id, reason, email] = body;

        const connection: Pool = await database();

        await connection.query("UPDATE hopper SET is_banned = 1 WHERE id = ?", [
            id,
        ]);

        await connection.end();

        await sendMail(
            email,
            "Your Account Has Been Banned",
            [
                { key: "email", value: email.toString() },
                { key: "reason", value: reason.toString() },
            ],
            "ban-hopper",
        );

        return "The hopper has been banned successfully.";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
