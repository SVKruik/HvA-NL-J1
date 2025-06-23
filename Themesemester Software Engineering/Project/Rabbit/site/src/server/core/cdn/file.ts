import { FileTypes } from "~/assets/customTypes";
import { sftpClient } from "./sftp";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath as string);
import path from "path";
import fs from "fs/promises";

/**
 * Upload a file to the SFTP server.
 * @param name The name of the file to upload. This is the Ticket name, so without the file extension.
 * @param type The type of the file to upload.
 * @param file The file itself.
 * @returns Status of the operation.
 */
export async function uploadFile(name: string, type: FileTypes, file: File): Promise<boolean> {
    const sftp = await sftpClient();
    let remotePath: string = `/files/${type}/${name}`;

    // Add the file extension based on the type
    if (![FileTypes.system, FileTypes.postVideo].includes(type)) remotePath += ".webp";
    if (type === FileTypes.postVideo) remotePath += ".mp4";

    // Upload the file to the SFTP server
    const buffer: Buffer = await compressionHandler(name, file, type);
    await sftp.put(buffer, remotePath);

    // Cleanup the local file if it was created
    if (type === FileTypes.postVideo) {
        const localPath: string = path.join(process.cwd(), "uploads", name);
        await fs.unlink(localPath + "-in.mp4");
        await fs.unlink(localPath + "-out.mp4");
    }

    sftp.end();
    return true;
}

/**
 * Check if a file exists on the SFTP server.
 * @param fullName The name of the file to check. This includes the file extension.
 * @param type The type of the file to check.
 * @returns Whether the file exists or not.
 */
export async function checkFile(fullName: string, type: FileTypes): Promise<boolean> {
    const sftp = await sftpClient();
    const remotePath: string = `/files/${type}/${fullName}`;
    const exists = await sftp.exists(remotePath);

    sftp.end();
    return Boolean(exists);
}

/**
 * Deletes a file from the SFTP server.
 * @param fullName The name of the file to delete. This includes the file extension.
 * @param type The type of the file to delete.
 * @returns Status of the operation.
 */
export async function deleteFile(fullName: string, type: FileTypes): Promise<boolean> {
    const sftp = await sftpClient();
    const remotePath: string = `/files/${type}/${fullName}`;
    const exists = await sftp.exists(remotePath);
    if (!exists) {
        return false;
    } else await sftp.delete(remotePath);

    sftp.end();
    return true;
}

/**
 * Compresses the file based on its type.
 * @param file The file to compress. Can be a video or image, but without the file extension.
 * @param type The type of the file. Different strategies are used for different file types.
 * @returns The compressed file as a Buffer.
 */
async function compressionHandler(name: string, file: File, type: FileTypes): Promise<Buffer> {
    const arrayBuffer: ArrayBuffer = await file.arrayBuffer();

    switch (type) {
        case FileTypes.hopperAvatar:
        case FileTypes.burrowAvatar:
            return await sharp(Buffer.from(arrayBuffer))
                .resize({ width: 200, height: 200, fit: "inside" })
                .toFormat("webp", { quality: 80 })
                .toBuffer();
        case FileTypes.hopperBanner:
        case FileTypes.burrowBanner:
            return await sharp(Buffer.from(arrayBuffer))
                .resize({ width: 1200, height: 300, fit: "inside" })
                .toFormat("webp", { quality: 80 })
                .toBuffer();
        case FileTypes.postImage:
            return await sharp(Buffer.from(arrayBuffer))
                .resize({ width: 1200, height: 1200, fit: "inside" })
                .toFormat("webp", { quality: 80 })
                .toBuffer();
        case FileTypes.system:
            // Leave system files as is
            return Buffer.from(arrayBuffer);
        case FileTypes.postVideo:
            const inputPath = await uploadLocally(name + ".mp4", file);
            await new Promise((resolve, reject) => {
                ffmpeg(inputPath)
                    .outputOptions([
                        "-vf scale=1280:-2",
                        "-c:v libx264",
                        "-crf 28",
                        "-preset veryfast",
                        "-c:a aac",
                        "-b:a 128k"
                    ])
                    .on("end", resolve)
                    .on("error", reject)
                    .save(inputPath.replace("-in", "-out"));
            });
            return Buffer.from(arrayBuffer);
        default:
            throw new Error("Unsupported file type");
    }
}

/**
 * Temporarily upload a file locally.
 * @param name The name of the file to upload.
 * @param file The file itself.
 * @returns The local path of the uploaded file.
 */
async function uploadLocally(name: string, file: File): Promise<string> {
    // Local upload path
    const arrayBuffer: ArrayBuffer = await file.arrayBuffer();
    const buffer: Buffer = Buffer.from(arrayBuffer);
    const fileName: string = name.replace(".", "-in.");
    const localPath: string = path.join(process.cwd(), "uploads", fileName);
    await fs.mkdir(path.join(process.cwd(), "uploads"), { recursive: true });
    await fs.writeFile(localPath, buffer);
    return localPath;
}