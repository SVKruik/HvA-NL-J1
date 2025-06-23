import { NotificationItem, NotificationTypes } from "~/assets/customTypes";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { formatApiError } from "~/utils/format";

export default defineEventHandler(async (event): Promise<Array<NotificationItem>> => {
    try {
        const hopperId: number = getQuery(event).hopperId ? parseInt(getQuery(event).hopperId as string) : 0;
        if (isNaN(hopperId) || hopperId <= 0) throw new Error("Invalid hopperId provided.", { cause: { statusCode: 1400 } });
        const connection: Pool = await database();

        const response: Array<{
            "hopper_id": number,
            "type": string,
            "data": any,
            "source": string,
            "url": string,
            "is_read": boolean,
            "ticket": string,
            "is_silent": boolean,
            "date_expiry": string,
            "date_creation": string,
        }> = await connection.query("SELECT * FROM hopper_notification WHERE hopper_id = ? AND date_expiry >= NOW();", [hopperId]);

        await connection.end();
        return response.map(item => ({
            hopper_id: item.hopper_id,
            type: item.type as NotificationTypes,
            data: item.data,
            source: item.source,
            url: item.url,
            is_read: !!item.is_read,
            ticket: item.ticket,
            is_silent: !!item.is_silent,
            date_expiry: new Date(item.date_expiry),
            date_creation: new Date(item.date_creation),
        }));
    } catch (error: any) {
        throw formatApiError(error);
    }
});