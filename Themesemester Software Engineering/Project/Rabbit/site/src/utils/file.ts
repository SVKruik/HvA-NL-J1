import { FileTypes } from "~/assets/customTypes";

/**
 * Get the CDN URL for a file.
 * @param name The name of the file. This is the Ticket name, so without the file extension.
 * @param type The type of the file.
 * @returns The full URL of the file.
 */
export function getFilePath(name: string | undefined | null, type: FileTypes | string): string {
    if (!name) return fallbackImage(type);
    if (name === "Burrow") return "/icons/burrow.svg";
    if (name === "Post") return "/icons/post.svg";

    let baseUrl = `https://cdn.rabbit-network.com/${type}/${name}`;
    // Add the file extension based on the type
    if (![FileTypes.system, FileTypes.postVideo].includes(type as FileTypes)) baseUrl += ".webp";
    if (type === FileTypes.postVideo) baseUrl += ".mp4";

    return baseUrl;
}

/**
 * Return the fallback image URL based on the file type.
 * @param type The type of the file. This controls the fallback image.
 * @returns The fallback image URL.
 */
export function fallbackImage(type: FileTypes | string): string {
    switch (type) {
        case FileTypes.hopperAvatar:
            return "/icons/avatar.svg"
        case FileTypes.burrowAvatar:
            return "/icons/burrow.svg"
        case FileTypes.burrowBanner:
            return "/img/banner.png"
        case FileTypes.hopperBanner:
            return "/img/banner.png"
        case FileTypes.postVideo:
            return "/icons/video.svg"
        case FileTypes.postImage:
        default:
            return "/img/error.png"
    }
}