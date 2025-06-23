import { database } from "~/server/utils/database";
import type { Pool } from "mariadb";
import { formatApiError } from "~/utils/format";
import type { BuddyStatus, Hopper } from "~/assets/customTypes";
import { Buddy } from "~/server/core/ges/buddy";

/**
 * API handler to fetch a hopper by username.
 *
 * @param event - The incoming API event containing route parameters.
 * @returns An object with hopper details or 404 if not found.
 */
export default defineEventHandler(async (event): Promise<Hopper> => {
    try {
        const username: string | undefined = getRouterParam(event, "username");
        const ownId: number | null = getQuery(event).ownId
            ? Number(getQuery(event).ownId)
            : null; // Only sent when visiting another Hopper's profile
        if (!username)
            throw Error("This Hopper does not exist.", {
                cause: { statusCode: 1400 },
            });

        const connection: Pool = await database();

        const [hopper] = await connection.query(
            `
            SELECT 
            h.id,
            h.email,
            h.username,
            h.description,
            h.avatar,
            h.banner,
            h.socials,
            h.achievements,
            h.status,
            h.can_view_nsfw,
            h.language,
            h.carrots,
            (
            SELECT COALESCE(SUM(p.value), 0)
            FROM hopper_praise p
            JOIN post po ON p.post_id = po.id
            WHERE po.hopper_id = h.id
            ) AS reputation,
            (
            SELECT COUNT(*) 
            FROM hopper_buddy 
            WHERE (hopper_id = h.id OR buddy_id = h.id)
              AND date_accepted IS NOT NULL
            ) AS buddies,
            h.date_creation,
            h.date_modified,
            h.date_verification,
            h.date_2fa,
            h.is_banned
            FROM hopper h
            WHERE h.username = ?
        `,
            [username],
        );

        if (!hopper)
            throw Error("This Hopper does not exist.", {
                cause: { statusCode: 1400 },
            });
        const buddyStatus: BuddyStatus = ownId
            ? await new Buddy(
                  null,
                  ownId,
                  Number(hopper.id),
                  connection,
              ).status()
            : { has_connection: false, is_accepted: false, is_incoming: false };

        const payload: Hopper = {
            id: Number(hopper.id),
            email: hopper.email,
            username: hopper.username,
            description: hopper.description ?? "",
            avatar: hopper.avatar ?? "",
            banner: hopper.banner ?? "",
            socials:
                typeof hopper.socials === "string"
                    ? JSON.parse(hopper.socials)
                    : {},
            achievements:
                typeof hopper.achievements === "string"
                    ? JSON.parse(hopper.achievements)
                    : hopper.achievements,
            buddies: Number(hopper.buddies),
            status: hopper.status,
            is_nsfw_allowed: Boolean(hopper.can_view_nsfw),
            language: hopper.language,
            carrots: Number(hopper.carrots),
            reputation: Number(hopper.reputation),
            date_creation: new Date(hopper.date_creation),
            date_modified: hopper.date_modified
                ? new Date(hopper.date_modified)
                : undefined,
            date_verification: hopper.date_verification
                ? new Date(hopper.date_verification)
                : null,
            date_2fa: hopper.date_2fa ? new Date(hopper.date_2fa) : null,
            buddy_status: buddyStatus,
            is_banned: hopper.is_banned,
        };
        await connection.end();
        return payload;
    } catch (error: any) {
        throw formatApiError(error);
    }
});
