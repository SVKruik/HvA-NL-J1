/**
 * Get the amount of Reputation the user gets for a specific achievement.
 * @param achievement The title of the achievement.
 * @returns The Reputation value and description of the achievement.
 */
export function getAchievementData(achievement: string): {
    "reputation": number;
    "description": string;
} | false {
    switch (achievement) {
        case "Make a post":
            return {
                "reputation": 10,
                "description": "You made your first post!",
            };
        case "Place a comment":
            return {
                "reputation": 5,
                "description": "Loud and clear! You made your first comment!",
            };
        case "Vote on a post or comment":
            return {
                "reputation": 2,
                "description": "You shared your opinion on a post or comment!",
            };
        case "Reach 100 Reputation": // Skipped
            return {
                "reputation": 15,
                "description": "Getting popular! You have reached 100 Reputation!",
            };
        case "Share a post": // Skipped
            return {
                "reputation": 2,
                "description": "Spread the word! You shared a post!",
            };
        case "Create a Burrow":
            return {
                "reputation": 10,
                "description": "Your own home! You made your first Burrow!",
            }
        case "Make a friend":
            return {
                "reputation": 5,
                "description": "Linking up! You made your first Buddy!",
            }
        case "Become a Keeper":
            return {
                "reputation": 5,
                "description": "Promotion! You became a Keeper!",
            }
        case "Get a follower": // Skipped
            return {
                "reputation": 5,
                "description": "You have a fan! You got your first Tail!",
            }
        case "Safety first!":
            return {
                "reputation": 10,
                "description": "You secured your account with 2FA!",
            }
        default:
            return false;
    }
}