import type { UserTypes } from "./assets/customTypes";

declare module "#auth-utils" {
    // General User
    interface User {
        id: number;
        username: string;
        email: string;
        type: keyof typeof UserTypes;
        avatar?: string;
        init: boolean;
    }

    // Session
    interface UserSession {
        loggedInAt: Date;
    }
}

export { }