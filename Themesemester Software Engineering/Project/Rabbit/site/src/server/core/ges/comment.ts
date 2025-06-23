import type { Pool } from "mariadb";

export class Comment {
    public id: number | null;
    public hopperId: number;
    public postId: number | null;
    public commentId: number | null;
    public type: "root" | "reply";
    public database: Pool;

    /**
     * A comment is a message created by a Hopper in a Post or other comment.
     * @param id The ID of the comment.
     * @param hopperId The author's ID.
     * @param postId The ID of the post where the comment is made.
     * @param commentId The ID of the comment being replied to.
     * @param type The type of comment: Root for top-level comments, Reply for replies to other comments.
     * @param database The database connection pool.
     */
    constructor(id: number | null, hopperId: number, postId: number | null, commentId: number | null, type: "root" | "reply", database: Pool) {
        this.id = id;
        this.hopperId = hopperId;
        this.postId = postId;
        this.commentId = commentId;
        this.type = type;
        this.database = database;
    }

    /**
     * Create a new comment.
     * @returns Status of the operation.
     */
    public async create(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Comment/Create",
            }, this.database);

            // Achievement handling
            await handleCommentCD("add", this.hopperId, this.database);

            // TODO: Insert comment into database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    public async reply(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Comment/Reply",
            }, this.database);

            return new Comment(null, this.hopperId, null, this.id, "reply", await database()).create();
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Edit a comment. This can only be done by the author.
     * @returns Status of the operation.
     */
    public async edit(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Comment/Edit",
            }, this.database);

            // TODO: Update comment in database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Delete a comment. Also deduct Reputation from the user who made the comment.
     * This can be done by the user who made the comment or a Keeper.
     * @returns Status of the operation.
     */
    public async delete(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Comment/Delete",
            }, this.database);

            // Achievement handling
            await handleCommentCD("delete", this.hopperId, this.database);

            // TODO: Delete comment from database

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }

    /**
     * Up/downvote a comment.
     * @returns Status of the operation.
     */
    public async praise(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.hopperId,
                "description": "GES Transaction",
                "source": "GES/Comment/Praise",
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
}