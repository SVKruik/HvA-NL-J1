import type {
    File,
    FileCreateResponse,
    FileOverviewItem,
    RawFile,
    RawUserDetailsResponse,
    RecentFileItem,
    UserData,
    ValidSession
} from "@/assets/customTypes";

/**
 * Fetch all available items for table overview.
 * @returns The files or boolean false if error.
 */
export async function fetchFileOverview(): Promise<Array<FileOverviewItem> | boolean> {
    try {
        const response = await fetch("https://mixit-backend.azurewebsites.net/fileOverview", {
            credentials: "include"
        });

        if (response.ok) {
            // Parse
            let data: { files: Array<{ name: string, link: string, id: number, isFolder: string }> } =
                await response.json();

            // Construct Objects
            const fileOverviewItems: Array<FileOverviewItem> = data.files.map((file) => {
                return {
                    ...file,
                    "name": file.name.split(".")[0],
                    "type": getRawImage(file.name, file.isFolder.toLowerCase() === "true"),
                    "isFolder": file.isFolder.toLowerCase() === "true"
                };
            });

            // Sort & Return
            return fileOverviewItems.sort(function (a, b) {
                return a.id - b.id;
            });
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

function getRawImage(name: string, isFolder: boolean): string {
    let rawImage: string = name.split(".")[1] || (isFolder ? "folder" : "unknown");
    if (rawImage === "onetoc2") rawImage = "one";
    return rawImage;

}

/**
 * Fetch all available items for table overview for a specific user.
 * @param email The email of the user that authored the files.
 * @returns The files or boolean false if error.
 */
export async function fetchFileAuthorOverview(email: string): Promise<Array<FileOverviewItem> | boolean> {
    try {
        const response = await fetch(`https://mixit-backend.azurewebsites.net/fileAuthorOverview/${email}`, {
            credentials: "include"
        });

        if (response.ok) {
            // Parse
            let data: { files: Array<{ name: string, link: string, id: number, isFolder: string }> } =
                await response.json();

            // Construct Objects
            const fileOverviewItems: Array<FileOverviewItem> = data.files.map((file) => {
                return {
                    ...file,
                    "name": file.name.split(".")[0],
                    "type": getRawImage(file.name, file.isFolder.toLowerCase() === "true"),
                    "isFolder": file.isFolder.toLowerCase() === "true"
                };
            });

            // Sort & Return
            return fileOverviewItems.sort(function (a, b) {
                return a.id - b.id;
            });
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch an individual file or folder by id.
 * @param id The file ID to retrieve. Handles folders and files.
 * @returns The file or boolean false if not found/error.
 */
export async function fetchFileDetails(id: number, link: string | undefined): Promise<File | boolean> {
    try {
        const response = await fetch(`https://mixit-backend.azurewebsites.net/fileDetails/${id}`, {
            credentials: "include"
        });

        if (response.ok) {
            // Parse & Return
            const data: RawFile = await response.json();
            return {
                "name": data.name,
                "id": parseInt(data.id),
                "image": data.fileimage === "x" ? null : data.fileimage,
                "path": data.filepath,
                "modifiedAuthorEmail": data.modifiedauthoremail,
                "modifiedAuthorImage": data.modifiedauthorimage,
                "modifiedAuthorName": data.modifiedauthorusername,
                "modifiedDate": new Date(data.modifieddate),
                "version": data.fileversion,
                "createdAuthorEmail": data.createdauthoremail,
                "createdAuthorImage": data.createdauthorimage,
                "createdAuthorName": data.createdauthorusername,
                "sinceVersion": data.sinceversion === "x" ? null : data.sinceversion,
                "untilVersion": data.untilversion === "x" ? null : data.untilversion,
                "size": parseInt(data.size),
                "isFolder": (data.isfolder.toLowerCase() === "true"),
                "link": link
            } as File;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch the top N amount of recently modified files for a user.
 * @param email The email of the user that authored the files.
 * @param limit The amount of top items to return.
 * @returns The files or boolean false if error.
 */
export async function fetchRecentFiles(email: string, limit: number): Promise<Array<RecentFileItem> | boolean> {
    try {
        const response = await fetch(`https://mixit-backend.azurewebsites.net/recentFiles/${email}/${limit}`, {
            credentials: "include"
        });

        if (response.ok) {
            // Parse
            let data: { files: Array<{ name: string, id: number, lastModified: string, image: string }> } =
                await response.json();

            // Construct Objects
            const recentFiles: Array<RecentFileItem> = data.files.map((file) => {
                return {
                    "name": file.name.split(".")[0],
                    "type": file.name.split(".")[1],
                    "id": file.id,
                    "lastModified": new Date(file.lastModified),
                    "image": file.image
                };
            }) as Array<RecentFileItem>;

            // Return
            return recentFiles;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch the Office User details.
 * @param email The email of the user to get details for.
 * @returns The user or boolean false if error.
 */
export async function fetchUserDetails(email: string): Promise<UserData | boolean> {
    try {
        const response = await fetch(`https://mixit-backend.azurewebsites.net/userDetails/${email}`, {
            credentials: "include"
        });

        if (response.ok) {
            // Parse & Return
            const data: RawUserDetailsResponse = await response.json();
            return {
                "email": email,
                "id": data.id,
                "firstName": data.name,
                "lastName": data.surname,
                "language": data.language,
                "type": data.type,
                "enabled": data.enabled.toLowerCase() === "true",
                "image": data.image
            } as UserData;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Fetch the Office User details.
 * @param email The email of the user to get details for.
 * @returns The user or boolean false if error.
 */
export async function fetchValidateSession(): Promise<ValidSession | boolean> {
    try {
        const response = await fetch("https://mixit-backend.azurewebsites.net/checkSession", {
            credentials: "include"
        });

        if (response.ok) {
            return await response.json() as ValidSession;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Clears the backend session.
 * @returns status
 */
export async function fetchLogout(): Promise<boolean> {
    try {
        const response = await fetch(`https://mixit-backend.azurewebsites.net/logout`, {
            credentials: "include"
        });

        return response.ok;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Creates a new file on SharePoint.
 * @param type The document type (Word, PowerPoint).
 * @param email The email of the author.
 * @param title The main title of the document.
 * @param subtitle The subtitle or description of the document.
 * @param path The target location.
 * @param getPreview If true, returns a preview image.
 * @returns Boolean on error, string on preview, object on creation.
 */
export async function fetchCreateFile(type: string, email: string, title: string, subtitle: string, path: string,
    getPreview: boolean): Promise<boolean | FileCreateResponse | string> {
    try {
        // const response = await fetch("http://localhost:5000/fileCreate", {
        const response = await fetch("https://mixit-backend.azurewebsites.net/fileCreate", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "type": type,
                "email": email,
                "title": title,
                "subtitle": subtitle,
                "path": path,
                "getPreview": getPreview
            })
        });
        // If getPreview is true, return the image
        if (response.ok) {
            if (getPreview) {
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } else return response.json();
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
