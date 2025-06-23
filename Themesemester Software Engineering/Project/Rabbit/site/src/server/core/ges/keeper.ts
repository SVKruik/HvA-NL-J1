import type { Pool } from "mariadb";

export class Keeper {
    public id: number | null;
    public hopperId: number; // Owner of the Burrow
    public burrowId: number;
    public database: Pool;

    /**
     * A Keeper is a Burrow-scoped moderator.
     * @param id The ID of the relation.
     * @param hopperId The ID of the Hopper.
     * @param burrowId The ID of the Burrow.
     * @param database The database connection pool.
     */
    constructor(id: number | null, hopperId: number, burrowId: number, database: Pool) {
        this.id = id;
        this.hopperId = hopperId;
        this.burrowId = burrowId;
        this.database = database;
    }

    /**
     * Create a new Keeper by linking a Hopper to a Burrow.
     * Only the Hopper of the original Burrow can add a Keeper.
     * @returns Status of the operation.
     */
    public async link(): Promise<boolean> {
        try {
            if (!this.burrowId) return false;
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Keeper/Link",
            }, this.database);

            // Achievement handling
            await handleKeeperCD("add", this.hopperId, this.database);

            // TODO: Insert Keeper into database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Unlink a Keeper from their Burrow.
     * Only the Hopper of the original Burrow can remove a Keeper.
     * @returns Status of the operation.
     */
    public async unlink(): Promise<boolean> {
        try {
            if (!this.burrowId) return false;
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Keeper/Unlink",
            }, this.database);

            // Achievement handling
            await handleKeeperCD("delete", this.hopperId, this.database);

            // TODO: Remove Keeper from database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }
}