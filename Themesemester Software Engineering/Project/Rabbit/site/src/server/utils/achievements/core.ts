import type { Pool } from "mariadb";
import { getAchievementData } from "~/utils/achievement";

/**
 * Add an achievement to the user's achievements.
 * If it already exists, it will be updated with the current date.
 * @param currentAchievements The current achievements of the user.
 * @param newAchievement The title of the achievement to add.
 * @param hopperId The ID of the user.
 * @param database The database connection.
 * @returns The updated achievements of the user.
 * @throws Error if the achievement is invalid.
 */
export async function addAchievement(currentAchievements: any, newAchievement: string, hopperId: number, database: Pool): Promise<object> {
    const achievementData = getAchievementData(newAchievement);
    if (!achievementData) throw new Error("Invalid achievement");

    currentAchievements[newAchievement] = new Date();
    await database.query("UPDATE hopper SET achievements = ?, reputation = reputation + ? WHERE id = ?", [currentAchievements, achievementData.reputation, hopperId]);
    return currentAchievements;
}

/**
 * Remove an achievement from the user's achievements.
 * @param currentAchievements The current achievements of the user.
 * @param achievement The title of the achievement to remove.
 * @returns The updated achievements of the user.
 * @throws Error if the achievement is invalid.
 */
export async function removeAchievement(currentAchievements: any, achievement: string, hopperId: number, database: Pool): Promise<object> {
    const achievementData = getAchievementData(achievement);
    if (!achievementData) throw new Error("Invalid achievement");

    delete currentAchievements[achievement];
    await database.query("UPDATE hopper SET achievements = ?, reputation = reputation - ? WHERE id = ?", [currentAchievements, achievementData.reputation, hopperId]);
    return currentAchievements;
}

/**
 * Check if the user has a specific achievement.
 * @param currentAchievements The current achievements of the user.
 * @param achievement The title of the achievement to check.
 * @returns If the user has the achievement.
 */
export function hasAchievement(currentAchievements: any, achievement: string): boolean {
    return achievement in currentAchievements;
}
