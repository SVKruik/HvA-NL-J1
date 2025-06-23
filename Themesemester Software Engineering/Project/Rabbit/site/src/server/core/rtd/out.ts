import { NotificationItem, NotificationTypes } from "~/assets/customTypes";
import { getPeer } from "./registry";
import type { Pool } from "mariadb";
import { getExclusions } from "~/utils/settings";

/**
 * Sends a notification to a peer via RTD.
 * If the user is offline they can fetch the database later to retrieve the notification.
 * @param data The notification data to send to the peer.
 * @param checkSettings Whether to check the user's settings for exclusions.
 * @returns Status of the operation.
 */
export async function sendPeer(data: NotificationItem, checkSettings: boolean): Promise<boolean> {
    try {
        const connection: Pool = await database();

        // Withdraw message that became invalid
        if ([NotificationTypes.buddyRemoved, NotificationTypes.buddyDeclined, NotificationTypes.buddyAccepted].includes(data.type)) {
            await connection.query(`DELETE FROM hopper_notification WHERE 
                ((JSON_VALUE(\`data\`, '$.buddy_id') = ?) AND hopper_id = ?) OR 
                ((JSON_VALUE(\`data\`, '$.buddy_id') = ?) AND hopper_id = ?)
                AND type IN (?, ?, ?, ?);`,
                [data.data.buddy_id, data.hopper_id, data.hopper_id, data.data.buddy_id, NotificationTypes.buddyRemoved, NotificationTypes.buddyDeclined, NotificationTypes.buddyAccepted, NotificationTypes.buddyNew]);
        }

        // Check notification settings for exclusions
        const originalIsSilent = data.is_silent;
        let isSilent: boolean = data.is_silent || false;
        if (checkSettings) isSilent = await checkIsSilent(data.hopper_id, data.type, connection);
        data.is_silent = isSilent;

        // Persist notification
        if (!getExclusions().includes(data.type)) await connection.query("INSERT INTO hopper_notification (hopper_id, type, data, source, url, ticket, is_silent, date_expiry, date_creation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);", [
            data.hopper_id,
            data.type,
            data.data,
            data.source,
            data.url,
            data.ticket,
            data.is_silent,
            data.date_expiry,
            data.date_creation
        ]);

        // RTD
        getPeer(data.hopper_id)?.send(JSON.stringify(data));

        // RTD - Buddies
        if (data.type.startsWith("buddy")) {
            data.is_silent = checkSettings ? await checkIsSilent(data.data.buddy_id, data.type, connection) : originalIsSilent;

            // Buddy messages are sent double to update both sides of the transactions.
            getPeer(data.data.buddy_id)?.send(JSON.stringify(data));
        }

        await connection.end();
        return true;
    } catch (error: any) {
        logError(error);
        return false;
    }
}

async function checkIsSilent(hopperId: number, type: NotificationTypes, connection: Pool): Promise<boolean> {
    const settings: Array<{
        "post_comment": number,
        "post_praise": number,
        "comment_reply": number,
        "comment_praise": number,
        "buddy_accepted": number,
        "buddy_request": number,
        "tail_accepted": number,
        "tail_request": number,
        "new_achievement": number,
    }> = await connection.query("SELECT * FROM hopper_notification_settings WHERE hopper_id = ?;", [hopperId]);

    if (settings.length === 0) return false;
    const userSettings = settings[0];

    if ((type === NotificationTypes.buddyNew && userSettings.buddy_request === 0) ||
        (type === NotificationTypes.buddyAccepted && userSettings.buddy_accepted === 0) ||
        (type === NotificationTypes.buddyDeclined && userSettings.buddy_accepted === 0) ||
        (type === NotificationTypes.buddyRemoved && userSettings.buddy_accepted === 0) ||
        (type === NotificationTypes.postComment && userSettings.post_comment === 0) ||
        (type === NotificationTypes.postPraise && userSettings.post_praise === 0) ||
        (type === NotificationTypes.commentReply && userSettings.comment_reply === 0) ||
        (type === NotificationTypes.commentPraise && userSettings.comment_praise === 0) ||
        (type === NotificationTypes.tailAccepted && userSettings.tail_accepted === 0) ||
        (type === NotificationTypes.tailNew && userSettings.tail_request === 0) ||
        (type === NotificationTypes.newAchievement && userSettings.new_achievement === 0)) {
        return true;
    } else return false;
}