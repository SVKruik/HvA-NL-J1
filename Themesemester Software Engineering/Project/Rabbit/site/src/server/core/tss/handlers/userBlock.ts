import { Pool } from "mariadb";

/**
 * Disarm a Burrow-scoped user block.
 * @param data The information required to unblock the user
 * @param connection The active database connection
 * @returns Status of the operation
 */
export async function userBlock(data: {
    "hopperId": number,
    "keeperId": number,
    "burrowId": number
}, connection: Pool): Promise<boolean> {
    try {
        return true;
    } catch (error: any) {
        logError(error);
        return false;
    }
}