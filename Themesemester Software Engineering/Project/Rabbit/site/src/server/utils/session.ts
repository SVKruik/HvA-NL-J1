import type { H3Event } from 'h3';
import { Pool } from 'mariadb';
import { UserData, UserTypes } from '~/assets/customTypes';

/**
 * Creates and returns a user session.
 * Also updates the last login date in the database.
 * 
 * @param event The request event
 * @param user The user data to store in the session 
 * @param connection The database connection to use
 * @returns The user data stored in the session
 */
export async function createUserSession(event: H3Event, user: {
    id: number;
    username: string;
    email: string;
    type: keyof typeof UserTypes;
    avatar?: string;
    init: boolean;
}, connection: Pool): Promise<UserData> {
    await setUserSession(event, {
        user: {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "type": user.type,
            "avatar": user.avatar,
            "init": user.init,
        },
        loggedInAt: new Date(),
    });

    // Update the last login date in the database
    await connection.query("UPDATE hopper SET date_last_login = CURRENT_TIMESTAMP WHERE id = ?", [user.id]);

    // Return the user data
    return (await getUserSession(event)).user as UserData;
}