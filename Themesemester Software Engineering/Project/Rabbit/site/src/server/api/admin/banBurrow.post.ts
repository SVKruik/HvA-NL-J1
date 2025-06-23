import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { sendMail } from "~/server/core/gmd/sendMail";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<string> => {
    try {
        const body = await readBody(event);
        const [name, reason] = body;

        const connection: Pool = await database();

        const result = await connection.query(
            "SELECT h.email FROM burrow b JOIN hopper h ON b.hopper_id = h.id WHERE b.name = ?",
            [name],
        );

        const email = result[0]?.email;
        if (!email) throw new Error("No email found for this burrow.");

        await connection.query(
            "UPDATE burrow SET is_banned = 1 WHERE name = ?",
            [name],
        );

        await sendMail(
            email,
            "Your Burrow Has Been Banned",
            [
                { key: "email", value: email },
                { key: "reason", value: reason },
                { key: "name", value: name },
            ],
            "ban-burrow",
        );

        await connection.end();

        return "The burrow has been banned successfully.";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
