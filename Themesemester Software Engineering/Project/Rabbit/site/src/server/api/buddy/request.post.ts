import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { z } from 'zod';
import { formatApiError } from '~/utils/format';
import { Buddy } from '~/server/core/ges/buddy';
import { BuddyStatus, NotificationTypes } from '~/assets/customTypes';
import { sendPeer } from '~/server/core/rtd/out';
import { createTicket } from '~/utils/ticket';

// Validation schema for the request body
const bodySchema = z.object({
    hopperId: z.number().int().positive(),
    buddyId: z.number().int().positive(),
    status: z.enum(["add", "remove"]),
});

export default defineEventHandler(async (event): Promise<BuddyStatus> => {
    try {
        const parseResult = bodySchema.safeParse(await readBody(event));
        if (!parseResult.success) throw new Error("The form is not completed correctly. Please try again.", { cause: { statusCode: 1400 } });
        const { hopperId, buddyId, status } = parseResult.data;
        const connection: Pool = await database();

        // Get Hopper information
        const hoppers: Array<{
            username: string;
            avatar: string | null;
        }> = await connection.query("SELECT username, avatar FROM hopper WHERE id = ?;", [hopperId]);
        if (hoppers.length === 0) throw new Error("Hopper not found. Please try again later.", { cause: { statusCode: 1404 } });
        const hopper = hoppers[0];

        if (status === "add") {
            const response: boolean = await new Buddy(null, hopperId, buddyId, connection).link();
            if (!response) throw new Error("Failed to invite Buddy. Please try again later.", { cause: { statusCode: 1500 } });
            await sendPeer({
                hopper_id: buddyId,
                type: NotificationTypes.buddyNew,
                data: {
                    buddy_id: hopperId,
                    username: hopper.username,
                    avatar: hopper.avatar,
                    avatar_type: "hopper/avatar",
                },
                source: "RTD - Buddy Request",
                url: `/h/${hopper.username}`,
                is_read: false,
                ticket: createTicket(),
                is_silent: false,
                date_expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                date_creation: new Date(),
            }, true);
        } else {
            const response: boolean = await new Buddy(null, hopperId, buddyId, connection).unlink();
            if (!response) throw new Error("Failed to cancel the Buddy invitation. Please try again later.", { cause: { statusCode: 1500 } });
            await sendPeer({
                hopper_id: buddyId,
                type: NotificationTypes.buddyRemoved,
                data: {
                    buddy_id: hopperId,
                    username: hopper.username,
                    avatar: hopper.avatar,
                    avatar_type: "hopper/avatar",
                },
                source: "RTD - Buddy Remove",
                url: `/h/${hopper.username}`,
                is_read: false,
                ticket: createTicket(),
                is_silent: false,
                date_expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                date_creation: new Date(),
            }, true);
        }

        const buddyStatus = await new Buddy(null, hopperId, buddyId, connection).status();
        await connection.end();
        return buddyStatus;
    } catch (error: any) {
        throw formatApiError(error);
    }
});