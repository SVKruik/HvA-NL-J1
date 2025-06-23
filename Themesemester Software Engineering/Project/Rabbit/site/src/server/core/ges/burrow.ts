import type { Pool } from "mariadb";
import { Post } from "./post";
import { PostTypes } from "~/assets/customTypes";

export class Burrow {
    public id: number | null;
    public hopperId: number; // Owner
    public adminId: number | undefined;
    public keeperId: number | undefined;
    public database: Pool;

    /**
     * A Burrow is a group of Hoppers that can create posts and comments.
     * @param id The ID of the Burrow.
     * @param hopperId The owner's ID.
     * @param adminId The ID of the Admin that manages the Burrow.
     * @param keeperId The ID of the Keeper that manages the Burrow.
     * @param database The database connection pool.
     */
    constructor(id: number | null, hopperId: number, adminId: number | undefined, keeperId: undefined, database: Pool) {
        this.id = id;
        this.hopperId = hopperId;
        this.adminId = adminId;
        this.keeperId = keeperId;
        this.database = database;
    }

    /**
     * Ban a Burrow.
     * @returns Status of the operation.
     */
    public async ban(): Promise<boolean> {
        try {
            if (!this.adminId) return false;
            await logGES({
                "objectType": "Admin",
                "objectId": this.adminId,
                "description": "GES Transaction",
                "source": "GES/Burrow/Ban",
            }, this.database);

            // Handle achievements
            await handleBurrowCD("delete", this.hopperId, this.database);

            // TODO: Update burrow status in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Unban a Burrow.
     * @returns Status of the operation.
     */
    public async unban(): Promise<boolean> {
        try {
            if (!this.adminId) return false;
            await logGES({
                "objectType": "Admin",
                "objectId": this.adminId,
                "description": "GES Transaction",
                "source": "GES/Burrow/Ban",
            }, this.database);

            // Handle achievements
            await handleBurrowCD("add", this.hopperId, this.database);

            // TODO: Update burrow status in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Create a new Burrow.
     * @returns Status of the operation.
     */
    public async create(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Burrow/Create",
            }, this.database);

            // Achievement handling
            await handleBurrowCD("add", this.hopperId, this.database);

            // TODO: Insert burrow into database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Edit the Burrow details.
     * This does not include Keeper relations.
     * @returns Status of the operation.
     */
    public async edit(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Burrow/Edit",
            }, this.database);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Delete a Burrow.
     * @returns Status of the operation.
     */
    public async delete(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Burrow/Delete",
            }, this.database);

            // Achievement handling
            await handleBurrowCD("delete", this.hopperId, this.database);

            // TODO: Delete burrow from database
            // How to handle posts and comments?

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Create a new Post in this Burrow.
     * @returns Status of the operation.
     */
    public async post(hopperId: number, type: PostTypes): Promise<boolean> {
        try {
            if (!this.id) return false;
            await logGES({
                "objectType": "Hopper",
                "objectId": hopperId,
                "description": "GES Transaction",
                "source": "GES/Burrow/Post",
            }, this.database);

            return new Post(null, hopperId, null, this.id, type, await database()).create();
        } catch (error: any) {
            logError(error);
            return false;
        }
    }
}