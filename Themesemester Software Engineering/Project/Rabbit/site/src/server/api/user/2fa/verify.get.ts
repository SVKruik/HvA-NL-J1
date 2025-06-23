import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { UserData } from "~/assets/customTypes";

export default defineEventHandler(async (event): Promise<UserData> => {
    try {
        const query = getQuery(event);
        const { email, code } = query;
        if (!email || !code) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const connection: Pool = await database();

        const response: Array<{
            "id": number,
            "username": string,
            "password": string,
            "avatar": string,
            "is_admin": number | null
        }> = await connection.query("SELECT hopper.id AS id, username, password, avatar, admin.id AS is_admin, pin FROM hopper LEFT JOIN admin on admin.hopper_id = hopper.id LEFT JOIN hopper_verification ON hopper_verification.hopper_email = hopper.email WHERE (email = ? OR secondary_email = ?) AND pin = ? AND reason = '2fa';", [email, email, code]);

        // Validate the response
        if (response.length === 0) throw new Error("The code you entered is incorrect. Please try again.", { cause: { statusCode: 1401 } });
        const hopper = response[0];

        // Create the session
        const session = await createUserSession(event, {
            id: hopper.id,
            username: hopper.username,
            email: email as string,
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