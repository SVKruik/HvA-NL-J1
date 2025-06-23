import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { z } from "zod";
import { sendMail } from "~/server/core/gmd/sendMail";
import { UserStatusTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";
import { Keeper } from "~/server/core/ges/keeper";

const bodySchema = z.object({
    email: z.string().email(),
    hopper_id: z.number().positive(),
    burrow_id: z.number().positive(),
    burrow_name: z.string(),
});

/**
 * API handler to assign a hopper as a keeper to a burrow.
 *
 * Validates the request body, verifies the user's account status,
 * sends a notification email, and updates the burrow_keeper table.
 * Returns 200 on success or throws a formatted error with status codes.
 *
 * @param event - The incoming API event containing the request body.
 * @throws Returns a formatted error with an appropriate HTTP status code and message.
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
            "new-keeper",
        );
        const result = await connection.query(
            "INSERT INTO burrow_keeper (hopper_id, burrow_id) VALUES (?, ?);",
            [hopper_id, burrow_id],
        );
        const keeper = new Keeper(
            result.insertId,
            hopper_id,
            hopper_id,
            connection,
        );
        await keeper.link();
        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
