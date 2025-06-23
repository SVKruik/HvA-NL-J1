import type { Pool } from "mariadb";
import { BuddyStatus } from "~/assets/customTypes";

export class Buddy {
    public id: number | null;
    public hopperId: number;
    public buddyId: number;
    public database: Pool;

    /**
     * A Buddy is a friend of a Hopper.
     * @param id The ID of the relation.
     * @param hopperId User A's ID. The inviter.
     * @param buddyId  User B's ID. The friend.
     * @param database The database connection pool.
     */
    constructor(id: number | null, hopperId: number, buddyId: number, database: Pool) {
        this.id = id;
        this.hopperId = hopperId;
        this.buddyId = buddyId;
        this.database = database;
    }

    /**
     * Create a new Buddy relation, if it doesn't already exist.
     * @returns Status of the operation.
     */
    public async link(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Buddy/Link",
            }, this.database);

            // Existing relation check
            if (await this.exists()) return true;

            await this.database.query(`
                INSERT INTO hopper_buddy (hopper_id, buddy_id)
                VALUES (?, ?)
            `, [this.hopperId, this.buddyId]);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Unlink a Buddy, if it exists.
     * @returns Status of the operation.
     */
    public async unlink(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Buddy/Unlink",
            }, this.database);

            // Achievement handling
            await handleBuddyCD("delete", this.hopperId, this.database);

            await this.database.query(`
                DELETE FROM hopper_buddy
                WHERE (hopper_id = ? AND buddy_id = ?)
                   OR (hopper_id = ? AND buddy_id = ?)
            `, [this.hopperId, this.buddyId, this.buddyId, this.hopperId]);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Check if the Buddy relation already exists.
     * @returns True if the Buddy relation exists, false otherwise.
     */
    public async exists(): Promise<boolean> {
        try {
            const [exists] = await this.database.query(`
                SELECT 1 FROM hopper_buddy
                WHERE (hopper_id = ? AND buddy_id = ?)
                   OR (hopper_id = ? AND buddy_id = ?)
                LIMIT 1
            `, [this.hopperId, this.buddyId, this.buddyId, this.hopperId]);

            return exists ? true : false;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Accepts the Buddy request.
     * @returns Accepts the Buddy request by updating the status of the Buddy relation to accepted.
     */
    public async accept(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Buddy/Accept",
            }, this.database);

            // Achievement handling
            await handleBuddyCD("add", this.hopperId, this.database);

            // Check if the Buddy relation exists
            if (!(await this.exists())) return false;

            // Update the status of the Buddy relation to accepted
            await this.database.query(`
                UPDATE hopper_buddy
                SET date_accepted = NOW()
                WHERE (hopper_id = ? AND buddy_id = ?)
                   OR (hopper_id = ? AND buddy_id = ?)
            `, [this.hopperId, this.buddyId, this.buddyId, this.hopperId]);
            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Rejects the Buddy request.
     * @returns Declines the Buddy request by unlinking the Buddy relation.
     */
    public async decline(): Promise<boolean> {
        return this.unlink();
    }

    /**
     * Checks the Buddy status between two Hoppers.
     * @returns An object containing the Buddy status.
     */
    public async status(): Promise<BuddyStatus> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Buddy/Status",
            }, this.database);

            const response: Array<{
                "is_accepted": 0 | 1,
                "is_initiator": 0 | 1
            }> = await this.database.query(`
                SELECT 
                    date_accepted IS NOT NULL AS is_accepted,
                    hopper_id = ? AS is_initiator
                FROM hopper_buddy
                WHERE (hopper_id = ? AND buddy_id = ?)
                   OR (hopper_id = ? AND buddy_id = ?)
            `, [this.hopperId, this.hopperId, this.buddyId, this.buddyId, this.hopperId]);

            if (!response.length) return { has_connection: false, is_accepted: false, is_incoming: false };
            return {
                has_connection: true,
                is_accepted: response[0].is_accepted ? true : false,
                is_incoming: response[0].is_initiator ? false : true
            };
        } catch (error: any) {
            logError(error);
            return { has_connection: false, is_accepted: false, is_incoming: false };
        }
    }
}