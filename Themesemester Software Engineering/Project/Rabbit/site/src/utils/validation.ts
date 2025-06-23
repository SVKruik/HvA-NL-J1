import { useFetchUsernameAvailable } from "./fetch/user/useFetchUsernameAvailable";

/**
 * Check if a given email is valid.
 * 
 * @param email The email to validate
 * @returns If the email is valid
 */
export function isValidEmail(email: string): boolean {
    // Basic regex for email validation
    // A verification mail is sent to validate anyway, so this suffices
    const regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
    return new RegExp(regex).test(email);
}

/**
 * Check if a given password is valid.
 * 
 * @param password The password to validate
 * @returns If the password is valid
 */
export function isValidPassword(password: string): boolean {
    // One uppercase, one lowercase, one digit, one special character, and at least 8 characters long
    const regex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*_-]).{8,}$";
    return new RegExp(regex).test(password);
}

/**
 * Check if a given recovery code is valid.
 * 
 * @param recoveryCode The code to validate
 * @returns If the code is valid
 */
export function isValidRecoveryCode(recoveryCode: number | null): boolean {
    if (!recoveryCode || isNaN(recoveryCode) || recoveryCode.toString().length !== 6) {
        return false;
    } else return true;
}

/**
 * Check if a given username is valid.
 * 
 * @param username The username to validate
 * @returns If the username is valid
 */
export async function isValidUsername(username: string, fetch: boolean = false): Promise<boolean> {
    if (username.length < 3 || username.length > 20) return false;

    // Letters, numbers, and underscores
    const regex = "^[a-zA-Z0-9_]+$"
    if (!new RegExp(regex).test(username)) return false;

    // Check if the username is already taken
    if (fetch && !(await useFetchUsernameAvailable(username))) return false;

    return true;
}