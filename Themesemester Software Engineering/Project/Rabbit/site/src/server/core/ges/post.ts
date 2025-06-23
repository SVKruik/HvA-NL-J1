import type { Pool } from "mariadb";
import { Comment } from "./comment";
import { PostTypes } from "~/assets/customTypes";

export class Post {
    public id: number | null;
    public hopperId: number;
    public keeperId: number | null;
    public burrowId: number;
    public type: PostTypes;
    public database: Pool;

    /**
     * A post is a message created by a Hopper in a Burrow.
     * @param id The ID of the post.
     * @param hopperId The author's ID.
     * @param keeperId The Keeper that manages the post.
     * @param burrowId The ID of the Burrow where the post is created.
     * @param database The database connection pool.
     */
    constructor(id: number | null, hopperId: number, keeperId: number | null, burrowId: number, type: PostTypes, database: Pool) {
        this.id = id;
        this.hopperId = hopperId;
        this.keeperId = keeperId;
        this.burrowId = burrowId;
        this.type = type;
        this.database = database;
    }

    /**
     * Create a new post.
     * @returns Status of the operation.
     */
    public async create(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Post/Create",
            }, this.database);

            // Achievement handling
            await handlePostCD("add", this.hopperId, this.database);

            // TODO: Insert post into database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Edit a post. This can only be done by the author.
     * @returns Status of the operation.
     */
    public async edit(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Post/Edit",
            }, this.database);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Delete a post. Also deduct Reputation from the user who made the post.
     * This can be done by the user who made the post or a Keeper.
     * Not really deleted but marked as deleted.
     * @returns Status of the operation.
     */
    public async delete(): Promise<boolean> {
        try {
            if (!this.keeperId) return false;
            await logGES({
                "objectType": "Keeper",
                "objectId": this.keeperId,
                "description": "GES Transaction",
                "source": "GES/Post/Delete",
            }, this.database);

            // Achievement handling
            await handlePostCD("delete", this.hopperId, this.database);

            // TODO: Delete post from database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * The post is praised by a Hopper.
     * @returns Status of the operation.
     */
    public async praise(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Post/Praise",
            }, this.database);

            // Achievement handling
            await handlePraiseCD(this.hopperId, this.database);

            // TODO: Insert praise into database
            // TODO: Check if author is Blocked in this Burrow

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Pin a post. This can only be done by a Keeper.
     * @returns Status of the operation.
     */
    public async pin(): Promise<boolean> {
        try {
            if (!this.keeperId) return false;
            await logGES({
                "objectType": "Keeper",
                "objectId": this.keeperId,
                "description": "GES Transaction",
                "source": "GES/Post/Pin",
            }, this.database);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Unpin a post. This can only be done by a Keeper.
     * @returns Status of the operation.
     */
    public async unpin(): Promise<boolean> {
        try {
            if (!this.keeperId) return false;
            await logGES({
                "objectType": "Keeper",
                "objectId": this.keeperId,
                "description": "GES Transaction",
                "source": "GES/Post/Unpin",
            }, this.database);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Report a post.
     * @returns Status of the operation.
     */
    public async report(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Post/Report",
            }, this.database);

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Comment under a post.
     * @returns Status of the operation.
     */
    public async comment(hopperId: number): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Post/Comment",
            }, this.database);

            return new Comment(null, hopperId, this.id, null, "root", await database()).create();
        } catch (error: any) {
            logError(error);
            return false;
        }
    }
}