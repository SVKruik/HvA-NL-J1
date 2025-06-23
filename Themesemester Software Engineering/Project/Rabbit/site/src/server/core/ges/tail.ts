import type { Pool } from "mariadb";

export class Tail {
    public id: number | null;
    public hopperId: number;
    public tailId: number;
    public database: Pool;

    /**
     * A Tail is a follower of a Hopper.
     * @param id The ID of the relation.
     * @param hopperId User A's ID. The followed.
     * @param tailId  User B's ID. The following.
     * @param database The database connection pool.
     */
    constructor(id: number | null, hopperId: number, tailId: number, database: Pool) {
        this.id = id;
        this.hopperId = hopperId;
        this.tailId = tailId;
        this.database = database;
    }

    /**
     * Create a new tail relation, if it doesn't already exist.
     * @returns Status of the operation.
     */
    public async link(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Tail",
                "objectId": null,
                "description": "GES Transaction",
                "source": "GES/Tail/Link",
            }, this.database);

            // TODO: Insert tail into database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Unlink a tail, if it exists.
     * @returns Status of the operation.
     */
    public async unlink(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Tail",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Tail/Unlink",
            }, this.database);

            // Achievement handling
            await handleTailCD("delete", this.hopperId, this.database);

            // TODO: Delete tail from database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Accept an incoming Tail request.
     * @returns Status of the operation.
     */
    public async accept(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Tail",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Tail/Accept",
            }, this.database);

            // Achievement handling
            await handleTailCD("add", this.hopperId, this.database);

            // TODO: Update tail in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }
}