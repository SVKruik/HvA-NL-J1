import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { sendMail } from "~/server/core/gmd/sendMail";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<string> => {
    try {
        const body = await readBody(event);
        const [name] = body;

        const connection: Pool = await database();

        await connection.query(
            "UPDATE burrow SET date_deleted = ? WHERE name = ?",
            [new Date(), name],
        );

        // select email of the burrow keepers and send them a email their burrow has been deleted
        const emails = await connection.query(
            `SELECT h.email FROM hopper h JOIN burrow_keeper bk ON h.id = bk.hopper_id JOIN burrow b ON bk.burrow_id = b.id WHERE b.name = ?`,
            [name],
        );

        for (const email of emails) {
            await sendMail(
                email.email,
                "Your Burrow Has Been Deleted",
                [
                    { key: "email", value: email.email },
                    { key: "name", value: name },
                ],
                "delete-burrow",
            );
        }

        await connection.end();

        return "The burrow has been deleted successfully.";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
