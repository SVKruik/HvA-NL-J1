import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { z } from "zod";
import { sendMail } from "~/server/core/gmd/sendMail";
import { UserStatusTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

const bodySchema = z.object({
    email: z.string().email(),
    hopper_id: z.number().positive(),
    burrow_id: z.number().positive(),
    burrow_name: z.string(),
});

/**
 * API handler to remove a keeper (hopper) from a burrow.
 *
 * Validates the incoming request body, checks the user's account status,
 * sends a notification email, and deletes the keeper association from the database.
 * Handles errors gracefully and returns appropriate HTTP status codes.
 *
 * @param event - The incoming API event containing the request body.
 * @throws Returns a formatted error with a relevant HTTP status code and message if something fails.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success)
            throw new Error(
                `he form is not completed correctly. Please try again. ${parseResult.data}}`,
                { cause: { statusCode: 1400 } },
            );
        const { email, hopper_id, burrow_id, burrow_name } = parseResult.data;
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
        await sendMail(
            email,
            "You are a keeper!",
            [{ key: "burrow", value: burrow_name.toString() }],
            "delete-keeper",
        );
        await connection.query(
            "DELETE FROM burrow_keeper WHERE hopper_id = ? AND burrow_id = ?;",
            [hopper_id, burrow_id],
        );

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
