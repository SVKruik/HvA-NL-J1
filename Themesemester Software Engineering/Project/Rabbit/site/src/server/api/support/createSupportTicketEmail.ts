import type { Pool } from "mariadb";
import { database } from "~/server/utils/database";
import { z } from "zod";
import { sendMail } from "~/server/core/gmd/sendMail";
import { UserStatusTypes } from "~/assets/customTypes";
import { formatApiError } from "~/utils/format";

// Validation schema for the request body
const bodySchema = z.object({
    email: z.string().email(),
    hopper_id: z.number().positive(),
    hopper_name: z.string(),
    title: z.string(),
    message: z.string(),
});

export default defineEventHandler(async (event): Promise<void> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success)
            throw new Error(
                `he form is not completed correctly. Please try again. ${parseResult.data}}`,
                { cause: { statusCode: 1400 } },
            );
        const { email, hopper_id, title, message, hopper_name } =
            parseResult.data;
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

        const query = `
INSERT INTO support_request (hopper_id, category, description) VALUES (?, ?, ?)
        `;
        await connection.query(query, [hopper_id, title, message]);
        await sendMail(
            "support@rabbit-network.com",
            "Support Ticket Confirmation",
            [
                { key: "email", value: email.toString() },
                { key: "hopper_id", value: hopper_id.toString() },
                { key: "hopper_name", value: hopper_name.toString() },
                { key: "message", value: message.toString() },
                { key: "title", value: title.toString() },
            ],
            "support-admin",
        );
        await sendMail(
            email,
            "Support Ticket Confirmation",
            [
                { key: "hopper_name", value: hopper_name.toString() },
                { key: "message", value: message.toString() },
                { key: "title", value: title.toString() },
            ],
            "support-admin-confirm",
        );

        // Return a success response
        await connection.end();
        return setResponseStatus(event, 200);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw formatApiError(error);
    }
});
