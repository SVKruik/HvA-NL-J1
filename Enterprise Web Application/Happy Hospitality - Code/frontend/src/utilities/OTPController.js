/**
 * OTP Controller
 * Creates new OTP codes used for forgot password.
 *
 * @author Milou Hogendoorn
 */

/**
 * Generates a new OTP code if user forgots there password.
 * A code is a string consisting of random numbers and letters, with a total length of 8 characters.
 *
 * @return {string} The random generated OTP code.
 */
export function createOTP() {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let OTP = "";

    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        OTP += characters.charAt(randomIndex);
    }

    return OTP;
}