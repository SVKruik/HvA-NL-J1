import { formatApiError } from "~/utils/format";
import type { Pool } from 'mariadb';
import { database } from '~/server/utils/database';
import { uploadFile } from '~/server/core/cdn/file';
import { FileTypes, ProfileDetailsPayload } from "~/assets/customTypes";

export default defineEventHandler(async (event): Promise<boolean> => {
    try {
        const formData: FormData = await readFormData(event);
        if (!formData) throw new Error("No form data provided.", { cause: { statusCode: 1400 } });

        // Read the form data
        const rawProfileDetails: string | null = formData.get("profileDetails") as string | null;
        if (!rawProfileDetails) throw new Error("Please complete all required fields and try again.", { cause: { statusCode: 1400 } });
        const profileDetails: ProfileDetailsPayload | null = JSON.parse(rawProfileDetails) as ProfileDetailsPayload | null;
        const avatarImage: File | null = formData.get("avatar") as File | null;
        const bannerImage: File | null = formData.get("banner") as File | null;

        // Validate the form data
        if (!profileDetails || !(profileDetails satisfies ProfileDetailsPayload)) throw new Error("Please complete all required fields and try again.", { cause: { statusCode: 1400 } });

        // Upload the images to the SFTP server
        if (profileDetails.avatar && avatarImage) await uploadFile(profileDetails.avatar, FileTypes.hopperAvatar, avatarImage);
        if (profileDetails.banner && bannerImage) await uploadFile(profileDetails.banner, FileTypes.hopperBanner, bannerImage);

        // Update Hopper information
        const connection: Pool = await database();
        await connection.query("UPDATE hopper SET description = ?, avatar = ?, banner = ?, is_nsfw = ?, socials = ? WHERE id = ?", [
            profileDetails.description,
            profileDetails.avatar,
            profileDetails.banner,
            profileDetails.isNsfw,
            JSON.stringify(profileDetails.socials),
            profileDetails.hopperId,
        ]);

        await connection.end();
        return true;
    } catch (error: any) {
        throw formatApiError(error);
    }
});