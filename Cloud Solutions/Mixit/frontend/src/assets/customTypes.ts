// Unprocessed User Details Response
export type RawUserDetailsResponse = {
    "email": string,
    "id": string,
    "name": string,
    "surname": string,
    "language": string,
    "type": string,
    "enabled": string,
    "image": string
}

// Validate Session Response
export type ValidSession = {
    "valid": string,
    "user": string,
}

// User Details
export type UserData = {
    "email": string,
    "id": string,
    "firstName": string,
    "lastName": string,
    "language": string,
    "type": string,
    "enabled": boolean,
    "image": string
}

// Individual File Overview Item
export type FileOverviewItem = {
    "id": number,
    "link": string | undefined,
    "name": string,
    "type": string,
    "isFolder": boolean
}

// Individual Recent File Item
export type RecentFileItem = {
    "name": string,
    "type": FileTypes,
    "id": number,
    "lastModified": Date,
    "image": string
}

// JavaScript Types
export enum ObjectTypes {
    bigint = "bigint",
    boolean = "boolean",
    function = "function",
    number = "number",
    object = "object",
    string = "string",
    symbol = "symbol",
    undefined = "undefined"
}

// Microsoft Office File Types
export enum FileTypes {
    docx = "Word",
    pptx = "PowerPoint",
    xlsx = "Excel",
    one = "OneNote",
    vsdx = "Visio",
    csv = "CSV",
    html = "HTML",
    pdf = "PDF",
    txt = "Plain Text",
    folder = "Folder",
    unknown = "Unknown"
}

// Date Formatter
export type DateFormat = {
    "date": string,
    "time": string,
    "today": Date
}

// Unprocessed File Details Response
export type RawFile = {
    "name": string,
    "id": string,
    "fileimage": string,
    "filepath": string,
    "modifiedauthoremail": string,
    "modifiedauthorimage": string,
    "modifiedauthorusername": string,
    "modifieddate": string,
    "fileversion": string,
    "createdauthoremail": string,
    "createdauthorimage": string,
    "createdauthorusername": string,
    "sinceversion": string,
    "untilversion": string,
    "size": string,
    "isfolder": string,
}

// Individual File Item
export type File = {
    "name": string,
    "id": number,
    "image": string,
    "path": string,
    "modifiedAuthorEmail": string,
    "modifiedAuthorImage": string,
    "modifiedAuthorName": string,
    "modifiedDate": Date,
    "version": string,
    "createdAuthorEmail": string,
    "createdAuthorImage": string,
    "createdAuthorName": string,
    "sinceVersion": string,
    "untilVersion": string,
    "size": number,
    "isFolder": boolean,
    "link": string | undefined
}

// File Table Column
export type FileTableColumn = {
    "field": string
    "name": string,
    "sortable": boolean
}

// Prompt/Informational Message Types
export enum PromptTypes {
    info = "info",
    success = "success",
    warning = "warning",
    danger = "danger"
}

// Pop-up Item
export type PopupItem = {
    "id": string,
    "type": PromptTypes,
    "message": string,
    "expiryMilliseconds": number
}

// Succes File Creation
export type FileCreateResponse = {
    "fileId": number | null,
    "path": string
}