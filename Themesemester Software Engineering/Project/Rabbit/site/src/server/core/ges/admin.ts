import type { Pool } from "mariadb";

export class Admin {
    private id: number;
    private database: Pool;

    /**
     * An Admin is a user with administrative privileges.
     * @param id The ID of the Admin.
     * @param database The database connection pool.
     */
    constructor(id: number, database: Pool) {
        this.id = id;
        this.database = database;
    }

    /**
     * Login as an Admin.
     * @returns Status of the operation.
     */
    public async loginAsAdmin(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Admin",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Admin/LoginAsAdmin",
            }, this.database);

            // TODO: Update admin status in database
            // Create session

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
    public async loginAsHopper(): Promise<boolean> {
        try {
            await logGES({
                "objectType": "Hopper",
                "objectId": this.id,
                "description": "GES Transaction",
                "source": "GES/Admin/LoginAsHopper",
            }, this.database);

            // TODO: Create session

            return true;
        } catch (error: any) {
            logError(error);
            return false;
        }
    }
}