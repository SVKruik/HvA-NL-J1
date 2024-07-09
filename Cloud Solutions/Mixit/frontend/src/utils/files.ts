import { FileTypes } from "@/assets/customTypes";

/**
 * Converts Base64 to image src input.
 * @param data Base64 input.
 * @returns The usuable image src input.
 */
export function convertImage(data: string): string {
    if (!data) return "";
    return `data:image/jpeg;base64,${data}`;
}

/**
 * Converts raw file types like .pptx to their respective Office product names like PowerPoint.
 * @param rawType Raw file type.
 * @returns Processed product name.
 */
export function fileType(rawType: string): string {
    return FileTypes[rawType as keyof typeof FileTypes];
}