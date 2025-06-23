import { database } from '~/server/utils/database';
import { getRouterParam, getQuery } from 'h3';
import type { Buddy } from '~/assets/customTypes';

export default defineEventHandler(async (event): Promise<Buddy[]> => {
    const username = getRouterParam(event, 'username');
    const rawViewerId = getQuery(event).viewerId;
    const viewerId = rawViewerId && !isNaN(Number(rawViewerId)) ? Number(rawViewerId) : null;

    if (!username) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid username' });
    }

    const connection = await database();

    const [hopper] = await connection.query(
        'SELECT id FROM hopper WHERE username = ? LIMIT 1',
        [username]
    );

    if (!hopper || !hopper.id) {
        await connection.end();
        throw createError({ statusCode: 404, statusMessage: 'Hopper not found' });
    }

    const hopperId = hopper.id;
    const isOwner = viewerId === hopperId;

    let whereClause = '';
    let queryParams: any[] = [];

    if (isOwner) {
        // Show all buddy connections and requests for your own profile
        whereClause = '(b.hopper_id = ? OR b.buddy_id = ?)';
        queryParams = [hopperId, hopperId];
    } else if (viewerId !== null) {
        // Show accepted buddies of the profile OR pending requests where viewer is involved
        whereClause = `(b.date_accepted IS NOT NULL AND (b.hopper_id = ? OR b.buddy_id = ?)) 
                    OR (b.hopper_id = ? AND b.buddy_id = ?) 
                    OR (b.buddy_id = ? AND b.hopper_id = ?)`;
        queryParams = [hopperId, hopperId, hopperId, viewerId, hopperId, viewerId];
    } else {
        // Show only accepted buddies of the profile for unauthenticated viewers
        whereClause = 'b.date_accepted IS NOT NULL AND (b.hopper_id = ? OR b.buddy_id = ?)';
        queryParams = [hopperId, hopperId];
    }

    const buddies: any[] = await connection.query(
        `
        SELECT 
            b.date_accepted,
            b.is_favorite,
            b.hopper_id,
            b.buddy_id,
            h1.id AS hopper_id_val,
            h1.username AS hopper_username,
            h1.avatar AS hopper_avatar,
            h2.id AS buddy_id_val,
            h2.username AS buddy_username,
            h2.avatar AS buddy_avatar
        FROM hopper_buddy AS b
        JOIN hopper AS h1 ON h1.id = b.hopper_id
        JOIN hopper AS h2 ON h2.id = b.buddy_id
        WHERE (${whereClause})
        ORDER BY b.is_favorite DESC, h2.username ASC
        `,
        queryParams
    );

    await connection.end();

    return buddies.map((b) => {
        const isPending = !b.date_accepted;
        const isIncoming = viewerId !== null ? isPending && b.buddy_id === viewerId : false;
        const isOutgoing = viewerId !== null ? isPending && b.hopper_id === viewerId : false;

        const isProfileHopper = b.hopper_id === hopperId;
        return {
            id: isProfileHopper ? b.buddy_id_val : b.hopper_id_val,
            username: isProfileHopper ? b.buddy_username : b.hopper_username,
            avatar: isProfileHopper ? b.buddy_avatar : b.hopper_avatar,
            is_favorite: viewerId === hopperId ? Boolean(b.is_favorite) : undefined,
            isPending,
            isIncoming,
            isOutgoing,
            isAccepted: b.date_accepted !== null,
        };
    });
});