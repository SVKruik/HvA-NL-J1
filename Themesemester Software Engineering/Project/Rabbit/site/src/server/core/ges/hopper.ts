import type { Pool } from "mariadb";
import { registerCron } from "../tss/registerCron";

export class Hopper {
    public id: number | null;
    public adminId: number | undefined;
    public keeperId: number | undefined;
    public database: Pool;

    /**
     * A Hopper is a user in the system.
     * @param id The ID of the Hopper.
     * @param adminId The ID of the Admin that manages the Hopper.
     * @param keeperId The ID of the Keeper that manages the Hopper.
     * @param database The database connection pool.
     */
    constructor(id: number | null, adminId: number, keeperId: number, database: Pool) {
        this.id = id;
        this.adminId = adminId;
        this.keeperId = keeperId;
        this.database = database;
    }

    /**
     * Create a new Hopper.
     * @returns Status of the operation.
     */
    public async create(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Stray",
                "objectId": null,
                "description": "GES Transaction",
                "source": "GES/Hopper/Create",
            }, this.database);

            // TODO: Insert Hopper into database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Edit a Hopper.
     * @returns Status of the operation.
     */
    public async edit(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Hopper/Edit",
            }, this.database);

            // TODO: Update Hopper in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Delete a Hopper.
     * @returns Status of the operation.
     */
    public async delete(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Hopper/Delete",
            }, this.database);

            // TODO: Delete Hopper from database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Login as a Hopper.
     * @returns Status of the operation.
     */
    public async login(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Hopper/Login",
            }, this.database);

            // TODO: Create session

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Flairs are Burrow-scoped labels.
     * This method is Create and Update.
     * @param burrowId The ID of the Burrow where the flair is created.
     * @param flairId The ID of the flair.
     * @returns Status of the operation.
     */
    public async flair(burrowId: number, flairId: number): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Hopper/Flair",
            }, this.database);

            // TODO: Update Hopper flair in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Block a Hopper from a Burrow.
     * @returns Status of the operation.
     */
    public async block(burrowId: number, unblockDate: Date): Promise<boolean> {
        try {
            if (!this.keeperId) return false;
            await logGES({
                "objectType": "Keeper",
                "objectId": this.keeperId,
                "description": "GES Transaction",
                "source": "GES/Hopper/Block",
            }, this.database);

            // Register disarmament cron job
            await registerCron({
                "type": "userBlock",
                "data": { "hopperId": this.id, "keeperId": this.keeperId, "burrowId": burrowId },
                "date_schedule": unblockDate,
            }, this.database);

            // TODO: Add Block to database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Give a Hopper a timeout.
     * @returns Status of the operation.
     */
    public async timeout(): Promise<boolean> {
        try {
            if (!this.adminId) return false;
            await logGES({
                "objectType": "Admin",
                "objectId": this.adminId,
                "description": "GES Transaction",
                "source": "GES/Hopper/Timeout",
            }, this.database);

            // TODO: Update Hopper status in database
            // await registerCron()

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Remove any active timeouts from a Hopper.
     * @returns Status of the operation.
     */
    public async untimeout(): Promise<boolean> {
        try {
            if (!this.adminId) return false;
            await logGES({
                "objectType": "Admin",
                "objectId": this.adminId,
                "description": "GES Transaction",
                "source": "GES/Hopper/UnTimeout",
            }, this.database);

            // TODO: Update Hopper status in database
            // Remove cron job

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Ban a Hopper.
     * @returns Status of the operation.
     */
    public async ban(): Promise<boolean> {
        try {
            if (!this.adminId) return false;
            await logGES({
                "objectType": "Admin",
                "objectId": this.adminId,
                "description": "GES Transaction",
                "source": "GES/Hopper/Ban",
            }, this.database);

            // TODO: Update Hopper status in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Unban a Hopper.
     * @returns Status of the operation.
     */
    public async unban(): Promise<boolean> {
        try {
            if (!this.adminId) return false;
            await logGES({
                "objectType": "Admin",
                "objectId": this.adminId,
                "description": "GES Transaction",
                "source": "GES/Hopper/UnBan",
            }, this.database);

            // TODO: Update Hopper status in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }
}