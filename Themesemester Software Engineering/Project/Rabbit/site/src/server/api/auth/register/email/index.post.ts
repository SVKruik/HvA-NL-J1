import type { Pool } from 'mariadb';
import { FileTypes, RegisterPayload, UserData } from '~/assets/customTypes';
import { createUserSession } from '~/server/utils/session';
import { database } from '~/server/utils/database';
import { formatApiError } from '~/utils/format';
import { sendMail } from '~/server/core/gmd/sendMail';
import { isValidEmail, isValidPassword, isValidUsername } from '~/utils/validation';
import { uploadFile } from '~/server/core/cdn/file';

/**
 * Register using email and password
 */
export default defineEventHandler(async (event): Promise<UserData> => {
    try {
        const formData: FormData = await readFormData(event);
        if (!formData) throw new Error("No form data provided.", { cause: { statusCode: 1400 } });

        // Read the form data
        const rawRegisterPayload: string | null = formData.get("registerPayload") as string | null;
        if (!rawRegisterPayload) throw new Error("Please complete all required fields and try again.", { cause: { statusCode: 1400 } });
        const registerPayload: RegisterPayload | null = JSON.parse(rawRegisterPayload) as RegisterPayload | null;
        const avatarImage: File | null = formData.get("profilePicture") as File | null;
        const bannerImage: File | null = formData.get("banner") as File | null;

        // Validate the form data
        if (!registerPayload || !(registerPayload satisfies RegisterPayload)) throw new Error("Please complete all required fields and try again.", { cause: { statusCode: 1400 } });
        if (registerPayload.avatar && !avatarImage) throw new Error("Something went wrong while uploading your profile picture. Please try again.", { cause: { statusCode: 1400 } });
        if (registerPayload.banner && !bannerImage) throw new Error("Something went wrong while uploading your banner picture. Please try again.", { cause: { statusCode: 1400 } });

        // Generate password if applicable
        if (registerPayload.loginMethod === "email" && !registerPayload.password) throw new Error("Please complete all required fields and try again.", { cause: { statusCode: 1400 } });
        const password: string | null = registerPayload.loginMethod === "email" ? await hashPassword(registerPayload.password as string) : null;

        // Validate information
        if (password && !isValidPassword(password)) throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.", { cause: { statusCode: 1400 } });
        if (!isValidUsername(registerPayload.username)) throw new Error("This username is invalid or already taken. Please try another one.", { cause: { statusCode: 1400 } });
        if (!isValidEmail(registerPayload.email)) throw new Error("Your email address is invalid. Please check for typos.", { cause: { statusCode: 1400 } });

        // Upload the images to the SFTP server
        if (registerPayload.avatar) await uploadFile(registerPayload.avatar, FileTypes.hopperAvatar, avatarImage as File);
        if (registerPayload.banner) await uploadFile(registerPayload.banner, FileTypes.hopperBanner, bannerImage as File);

        // Store the user in the database
        const connection: Pool = await database();
        const response = await connection.query("INSERT INTO hopper (email, username, description, avatar, banner, password, date_last_login) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", [
            registerPayload.email,
            registerPayload.username,
            registerPayload.description,
            registerPayload.avatar,
            registerPayload.banner,
            password,
        ]);

        // Connect Buddies to the user
        if (registerPayload.buddies && registerPayload.buddies.length) registerPayload.buddies.forEach(async (buddy) => {
            await connection.query("INSERT INTO hopper_buddy (hopper_id, buddy_id, is_favorite) VALUES (?, ?, ?);", [
                Number(response.insertId),
                buddy.id,
                buddy.isFavorite,
            ]);
        });

        // Start the verification process
        // Also insert the settings for the user
        const verificationPin = Math.floor(100000 + Math.random() * 900000);
        await connection.query("INSERT INTO hopper_verification (hopper_email, pin, reason) VALUES (?, ?, ?); INSERT INTO hopper_notification_settings (hopper_id) VALUES (?);", [
            registerPayload.email,
            verificationPin,
            "setup",
            Number(response.insertId),
        ]);

        // Dispatch the verification email
        await sendMail(registerPayload.email, "Account Verification Code", [{
            "key": "verificationPin", "value": verificationPin.toString(),
        }], "verification");

        // Create the session
        const session = await createUserSession(event, {
            id: Number(response.insertId),
            username: registerPayload.username,
            email: registerPayload.email,
            type: "Hopper",
            avatar: registerPayload.avatar,
            init: true,
        }, connection);
        await connection.end();
        return session;
    } catch (error: any) {
        if (error.message?.includes("email_UNIQUE")) {
            throw createError({
                statusCode: 400,
                statusMessage: "An account with this email already exists. Try logging in instead.",
            });
        } else if (error.message?.includes("username_UNIQUE")) throw createError({
            statusCode: 400,
            statusMessage: "An account with this username already exists. Try logging in instead.",
        });

        throw formatApiError(error);
    }
});