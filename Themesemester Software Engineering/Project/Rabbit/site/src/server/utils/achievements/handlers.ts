import type { Pool } from "mariadb";
import { addAchievement, removeAchievement } from "./core";

/**
 * Handle achievements for posts.
 * Create (C) or Delete (D) a post.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handlePostCD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT COUNT(post.id) as count, achievements FROM hopper LEFT JOIN post ON post.hopper_id = hopper.id WHERE hopper.id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return handleAchievement(mode, data, "Make a post", hopperId, database);
}

/**
 * Handle achievements for comments.
 * Create (C) or Delete (D) a comment.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handleCommentCD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT COUNT(post_comment.id) as count, achievements FROM hopper LEFT JOIN post_comment ON post_comment.hopper_id = hopper.id WHERE hopper.id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return await handleAchievement(mode, data, "Place a comment", hopperId, database);
}


/**
 * Handle achievements for praises on posts and comments.
 * Create (C) or Delete (D) a praise.
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handlePraiseCD(hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON

        // Exclude own content from praises.
    }> = await database.query(`
        SELECT SUM(count) AS total_count FROM (
            SELECT COUNT(*) AS count
            FROM hopper_praise
            LEFT JOIN post ON post.id = hopper_praise.post_id
            WHERE hopper_praise.hopper_id = ?
                AND hopper_praise.post_id IS NOT NULL
                AND post.hopper_id != ?

            UNION ALL

            SELECT COUNT(*) AS count
            FROM hopper_praise
            LEFT JOIN post_comment ON post_comment.id = hopper_praise.comment_id
            WHERE hopper_praise.hopper_id = ?
                AND hopper_praise.comment_id IS NOT NULL
                AND post_comment.hopper_id != ?
        ) AS sub;`, [hopperId, hopperId, hopperId, hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;
    if (!data[0].count) await addAchievement(data[0].achievements, "Vote on a post or comment", hopperId, database);

    return true;
}

/**
 * Handle achievements for Burrows.
 * Create (C) or Delete/Ban (D) a Burrow.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handleBurrowCD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT COUNT(burrow.id) as count, achievements FROM hopper LEFT JOIN burrow ON burrow.hopper_id = hopper.id WHERE hopper.id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return await handleAchievement(mode, data, "Create a Burrow", hopperId, database);
}

/**
 * Handle achievements for Buddies.
 * Create (C) or Delete (D) a Buddy.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handleBuddyCD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT COUNT(hopper_buddy.id) as count, achievements FROM hopper LEFT JOIN hopper_buddy ON hopper_buddy.hopper_id = hopper.id WHERE hopper.id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return await handleAchievement(mode, data, "Make a friend", hopperId, database);
}

/**
 * Handle achievements for Keepers.
 * Create (C) or Delete (D) a Keeper.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handleKeeperCD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT COUNT(burrow_keeper.id) as count, achievements FROM hopper LEFT JOIN burrow_keeper ON burrow_keeper.hopper_id = hopper.id WHERE hopper.id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return await handleAchievement(mode, data, "Become a Keeper", hopperId, database);
}

/**
 * Handle achievements for Tails.
 * Create (C) or Delete (D) a Tail.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handleTailCD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT COUNT(hopper_tail.id) as count, achievements FROM hopper LEFT JOIN hopper_tail ON hopper_tail.hopper_id = hopper.id WHERE hopper.id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return await handleAchievement(mode, data, "Get a follower", hopperId, database);
}

/**
 * Handle achievements for 2FA.
 * Add (C) or Delete (D) 2FA.
 * @param mode Add or delete
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns Status of the operation.
 */
export async function handle2FACD(mode: "add" | "delete", hopperId: number, database: Pool): Promise<boolean> {
    const data: Array<{
        "count": number;
        "achievements": any; // JSON
    }> = await database.query("SELECT date_2fa IS NULL AS count, achievements FROM hopper WHERE id = ?;", [hopperId]);
    if (data.length === 0 || !data[0].achievements) return false;

    return await handleAchievement(mode, data, "Safety first!", hopperId, database);
}

/**
 * Add or remove an achievement based on the mode and data.
 * @param mode Add or delete
 * @param data The data count and current achievements.
 * @param title The title of the achievement.
 * @param hopperId The ID of the user
 * @param database The database connection.
 * @returns 
 */
async function handleAchievement(mode: "add" | "delete", data: Array<{
    "count": number;
    "achievements": any; // JSON
}>, title: string, hopperId: number, database: Pool): Promise<boolean> {
    if (mode === "add" && !data[0].achievements[title]) await addAchievement(data[0].achievements, title, hopperId, database);
    if (mode === "delete" && data[0].achievements[title]) await removeAchievement(data[0].achievements, title, hopperId, database);
    return true;
} 