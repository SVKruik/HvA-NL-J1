import { Pool } from "mariadb";
import { UserStatusTypes } from "~/assets/customTypes";

/**
 * Disarm a user timeout if the user is not banned.
 * @param data The hopper id to check
 * @param connection The active database connection
 * @returns Status of the operation
 */
export async function userTimeout(data: { "hopperId": number }, connection: Pool): Promise<boolean> {
    try {
        const { hopperId }: { hopperId: number } = data;
        if (!hopperId) return false;

        const hopper: Array<{
            "id": number,
            "status": keyof typeof UserStatusTypes,
        }> = await connection.query("SELECT id, status FROM hopper WHERE id = ?", [hopperId]);
        if (hopper.length === 0) {
            log(`[CRON / User timeout] Hopper ${hopperId} not found.`, "warning");
            return false;
        };

        if (hopper[0].status === "timeout") {
            await connection.query("UPDATE hopper SET status = 'active' WHERE id = ?", [hopperId])
        } else if (hopper[0].status === "banned") {
            log(`[CRON / User timeout] Hopper ${hopperId} is banned, but a timeout disarm was tried.`, "warning");
            return false;
        }
        return true;
    } catch (error: any) {
        logError(error);
        return false;
    }
}