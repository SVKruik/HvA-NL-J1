import { database } from "~/server/utils/database";
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        const burrow_id = Number(query.burrow_id);
        const hopper_id = Number(query.hopper_id);

        if (!burrow_id || !hopper_id) {
            throw createError({
                statusCode: 400,
                statusMessage: "Missing burrow_id or hopper_id",
            });
        }

        const connection = await database();
        const [row] = await connection.query(
            `SELECT EXISTS (
                SELECT 1 FROM burrow_member
                WHERE burrow_id = ? AND hopper_id = ?
            ) AS is_member`,
            [burrow_id, hopper_id],
        );
        await connection.end();
        return { is_member: row?.is_member ? 1 : 0 };
    } catch (error: any) {
        throw formatApiError(error);
    }
});
