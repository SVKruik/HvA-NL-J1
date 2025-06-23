import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { z } from "zod";
import { sendMail } from "~/server/core/gmd/sendMail";
import { UserStatusTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

const bodySchema = z.object({
    email: z.string(),
    emailUser: z.string().email(),
    hopper_id: z.number().positive(),
    hopper_name: z.string(),
    burrow_name: z.string(),
    title: z.string(),
    message: z.string(),
});

/**
 * API handler to submit a support ticket for a keeper.
 *
 * Validates the input, verifies the user's account status,
 * sends confirmation to the user and notification to the support team.
 *
 * @param event - The incoming API event containing the request body.
 * @throws Returns a formatted error with appropriate HTTP status if validation or DB checks fail.
 */
export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success)
            throw new Error(
                `he form is not completed correctly. Please try again. ${parseResult.data}}`,
                { cause: { statusCode: 1400 } },
            );
        const {
            email,
            emailUser,
            hopper_id,
            hopper_name,
            burrow_name,
            message,
            title,
        } = parseResult.data;
        const connection: Pool = await database();

        // Check if the account exists
        const checkResponse: Array<{ status: keyof typeof UserStatusTypes }> =
            await connection.query(
                "SELECT status FROM hopper WHERE email = ? LIMIT 1;",
                [emailUser],
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
            emailUser,
            "Support Ticket Confirmation",
            [
                { key: "burrow_name", value: burrow_name.toString() },
                { key: "hopper_name", value: hopper_name.toString() },
                { key: "message", value: message.toString() },
                { key: "title", value: title.toString() },
            ],
            "support-confirm",
        );
        await sendMail(
            email,
            "New Support Ticket",
            [
                { key: "email", value: emailUser.toString() },
                { key: "burrow_name", value: burrow_name.toString() },
                { key: "hopper_name", value: hopper_name.toString() },
                { key: "hopper_id", value: hopper_id.toString() },
                { key: "message", value: message.toString() },
                { key: "title", value: title.toString() },
            ],
            "support-keeper",
        );

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
